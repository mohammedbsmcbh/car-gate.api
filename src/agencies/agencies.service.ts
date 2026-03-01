import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateAgencyDto,
    UpdateAgencyDto,
    CreateSubAdminDto,
    AgencyFilterDto,
} from './dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AgenciesService {
    constructor(private prisma: PrismaService) { }

    /**
     * Backfills missing `Agency` rows for users with role AGENCY.
     * This fixes legacy data where user accounts existed/were approved but the related
     * agency profile record was never created.
     */
    async backfillMissingAgencies() {
        // Backfill AGENCIES and SHOWROOMS
        const usersMissingAgency = await this.prisma.user.findMany({
            where: {
                role: { in: ['AGENCY', 'SHOWROOM'] },
                AND: [
                    { agency: { is: null } },
                    { showroom: { is: null } }
                ]
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                commercialRecord: true,
                isApproved: true,
            },
        });

        if (usersMissingAgency.length === 0) return;

        // Process sequentially to handle different tables
        for (const u of usersMissingAgency) {
            const name = (u.name?.trim() || u.email) as string;
            
            if (u.role === 'AGENCY') {
                await this.prisma.agency.create({
                    data: {
                        userId: u.id,
                        name: name,
                        commercialRecord: u.commercialRecord ?? null,
                        isApproved: u.isApproved,
                    }
                }).catch(() => {}); // Ignore if created in parallel
            } else if (u.role === 'SHOWROOM') {
                await this.prisma.showroom.create({
                    data: {
                        userId: u.id,
                        name: name,
                        commercialRecord: u.commercialRecord ?? null,
                        isApproved: u.isApproved,
                    }
                }).catch(() => {});
            }
        }
    }

    async create(dto: CreateAgencyDto, userId: string) {
        // Check if user already has an agency
        const existing = await this.prisma.agency.findUnique({
            where: { userId },
        });

        if (existing) {
            throw new ConflictException('User already has an agency');
        }

        const agency = await this.prisma.agency.create({
            data: {
                ...dto,
                userId,
            },
        });

        return agency;
    }

    async findAll(filters: AgencyFilterDto, page = 1, limit = 20) {
        const where: Prisma.AgencyWhereInput = {};

        if (filters.city) {
            where.city = { contains: filters.city, mode: 'insensitive' };
        }

        if (filters.isApproved !== undefined) {
            where.isApproved = filters.isApproved;
        }

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { nameAr: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const [agencies, total] = await Promise.all([
            this.prisma.agency.findMany({
                where,
                include: {
                    user: {
                        select: { id: true, name: true, phone: true, email: true, isActive: true },
                    },
                    _count: {
                        select: { listings: true },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.agency.count({ where }),
        ]);

        return {
            data: agencies,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const agency = await this.prisma.agency.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, phone: true, whatsapp: true, email: true, isActive: true },
                },
                subAdmins: {
                    select: { id: true, name: true, email: true, isActive: true, createdAt: true },
                },
                listings: {
                    where: { status: 'APPROVED' },
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        media: { where: { isPrimary: true }, take: 1 },
                    },
                },
                _count: {
                    select: { listings: true, subAdmins: true },
                },
            },
        });

        if (!agency) {
            throw new NotFoundException('Agency not found');
        }

        return agency;
    }

    async findByUserId(userId: string) {
        const agency = await this.prisma.agency.findUnique({
            where: { userId },
            include: {
                subAdmins: {
                    select: { id: true, email: true, name: true, isActive: true },
                },
                _count: {
                    select: { listings: true },
                },
            },
        });

        if (!agency) {
            throw new NotFoundException('Agency not found');
        }

        return agency;
    }

    async update(id: string, dto: UpdateAgencyDto, userId: string) {
        const agency = await this.prisma.agency.findUnique({
            where: { id },
        });

        if (!agency) {
            throw new NotFoundException('Agency not found');
        }

        if (agency.userId !== userId) {
            throw new ForbiddenException('Cannot update this agency');
        }

        return this.prisma.agency.update({
            where: { id },
            data: dto,
        });
    }

    async approve(id: string, approved: boolean) {
        const agency = await this.prisma.agency.update({
            where: { id },
            data: { isApproved: approved },
        });

        // Also update user approval status and activate account
        await this.prisma.user.update({
            where: { id: agency.userId },
            data: { 
                isApproved: approved,
                isActive: approved ? true : undefined
            },
        });

        return agency;
    }

    // Sub-admin management
    async addSubAdmin(agencyId: string, dto: CreateSubAdminDto, userId: string) {
        const agency = await this.prisma.agency.findUnique({
            where: { id: agencyId },
        });

        if (!agency || agency.userId !== userId) {
            throw new ForbiddenException('Cannot manage this agency');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const subAdmin = await this.prisma.agencySubAdmin.create({
            data: {
                agencyId,
                email: dto.email,
                name: dto.name,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
            },
        });

        return subAdmin;
    }

    async removeSubAdmin(agencyId: string, subAdminId: string, userId: string) {
        const agency = await this.prisma.agency.findUnique({
            where: { id: agencyId },
        });

        if (!agency || agency.userId !== userId) {
            throw new ForbiddenException('Cannot manage this agency');
        }

        await this.prisma.agencySubAdmin.delete({
            where: { id: subAdminId },
        });

        return { message: 'Sub-admin removed successfully' };
    }

    async remove(id: string) {
        const agency = await this.prisma.agency.findUnique({
            where: { id },
        });

        if (!agency) {
            throw new NotFoundException('Agency not found');
        }

        await this.prisma.agency.delete({
            where: { id },
        });

        return { message: 'Agency deleted successfully' };
    }

    async getSubAdmins(agencyId: string, userId: string) {
        const agency = await this.prisma.agency.findUnique({
            where: { id: agencyId },
        });

        if (!agency || agency.userId !== userId) {
            throw new ForbiddenException('Cannot view this agency');
        }

        return this.prisma.agencySubAdmin.findMany({
            where: { agencyId },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                createdAt: true,
            },
        });
    }
}
