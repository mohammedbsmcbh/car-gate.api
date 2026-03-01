import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto, UpdateComplaintDto } from './dto';
import { ComplaintStatus, Prisma } from '@prisma/client';

@Injectable()
export class ComplaintsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateComplaintDto, authorId: string) {
        const complaint = await this.prisma.complaint.create({
            data: {
                authorId,
                targetId: dto.targetId,
                subject: dto.subject,
                description: dto.description,
            },
            include: {
                author: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return complaint;
    }

    async findAll(status?: ComplaintStatus, page = 1, limit = 20) {
        const where: Prisma.ComplaintWhereInput = {};

        if (status) {
            where.status = status;
        }

        const [complaints, total] = await Promise.all([
            this.prisma.complaint.findMany({
                where,
                include: {
                    author: {
                        select: { id: true, name: true, email: true },
                    },
                    target: {
                        select: { id: true, name: true, email: true },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.complaint.count({ where }),
        ]);

        return {
            data: complaints,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const complaint = await this.prisma.complaint.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, email: true, phone: true },
                },
                target: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
        });

        if (!complaint) {
            throw new NotFoundException('Complaint not found');
        }

        return complaint;
    }

    async update(id: string, dto: UpdateComplaintDto, userId?: string, userRole?: string) {
        const complaint = await this.findOne(id);

        // Only super admin or the author can update
        if (userRole !== 'SUPER_ADMIN' && complaint.authorId !== userId) {
            throw new ForbiddenException('Cannot update this complaint');
        }

        const updateData: Prisma.ComplaintUpdateInput = {
            ...dto,
        };

        if (dto.status === ComplaintStatus.RESOLVED || dto.status === ComplaintStatus.CLOSED) {
            updateData.resolvedAt = new Date();
        }

        return this.prisma.complaint.update({
            where: { id },
            data: updateData,
        });
    }

    async getMyComplaints(userId: string, page = 1, limit = 20) {
        const where: Prisma.ComplaintWhereInput = { authorId: userId };

        const [complaints, total] = await Promise.all([
            this.prisma.complaint.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.complaint.count({ where }),
        ]);

        return {
            data: complaints,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
