import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateUserDto, AdminUpdateUserDto, UserFilterDto } from './dto';
import { ApprovalStatus, UserRole, Prisma } from '@prisma/client';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private mailService: MailService,
        private auditLogs: AuditLogsService,
        private notificationsService: NotificationsService,
    ) { }

    async findAll(filters: UserFilterDto, page = 1, limit = 20) {
        const where: Prisma.UserWhereInput = {};

        if (filters.role) {
            where.role = filters.role;
        }

        if (filters.isApproved !== undefined) {
            where.isApproved = filters.isApproved;
        }

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    phone: true,
                    isApproved: true,
                    isActive: true,
                    createdAt: true,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                whatsapp: true,
                avatar: true,
                coverImage: true,
                isApproved: true,
                isActive: true,
                commercialRecord: true,
                createdAt: true,
                updatedAt: true,
                agency: true,
                showroom: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async update(id: string, dto: UpdateUserDto, currentUserId: string) {
        // Users can only update their own profile
        if (id !== currentUserId) {
            throw new ForbiddenException('Cannot update other users');
        }

        const user = await this.prisma.user.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                whatsapp: true,
                avatar: true,
                coverImage: true,
            },
        });

        return user;
    }

    async adminUpdate(id: string, dto: AdminUpdateUserDto) {
        const user = await this.prisma.user.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isApproved: true,
                isActive: true,
            },
        });

        return user;
    }

    async approve(id: string, adminId: string, approved: boolean, notes?: string) {
        // Get user info for email
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                commercialRecord: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.prisma.$transaction(async (tx) => {
            // Update user approval status
            await tx.user.update({
                where: { id },
                data: { 
                    isApproved: approved,
                    status: approved ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED
                },
            });

            // Keep agency/showroom profile approval in sync with user approval.
            // This also ensures that admin dashboards that list Agency/Showroom entities
            // are populated after approving accounts.
            if (user.role === UserRole.AGENCY) {
                const defaultName = user.name?.trim() || user.email;
                await tx.agency.upsert({
                    where: { userId: user.id },
                    create: {
                        userId: user.id,
                        name: defaultName,
                        commercialRecord: user.commercialRecord ?? null,
                        isApproved: approved,
                    },
                    update: {
                        isApproved: approved,
                        commercialRecord: user.commercialRecord ?? undefined,
                    },
                });
            }

            if (user.role === UserRole.SHOWROOM) {
                const defaultName = user.name?.trim() || user.email;
                await tx.showroom.upsert({
                    where: { userId: user.id },
                    create: {
                        userId: user.id,
                        name: defaultName,
                        commercialRecord: user.commercialRecord ?? null,
                        isApproved: approved,
                    },
                    update: {
                        isApproved: approved,
                        commercialRecord: user.commercialRecord ?? undefined,
                    },
                });
            }
        });

        // Create approval record
        await this.prisma.adminApproval.create({
            data: {
                targetId: id,
                adminId,
                status: approved ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED,
                notes,
            },
        });

        // Send email notification
        if (approved) {
            await this.mailService.sendApprovalEmail(user.email, user.name || 'User');
            await this.notificationsService.create(
                id,
                'Account Approved',
                'Your account has been approved. You can now access all features.',
                'USER_APPROVED',
            );
        } else {
            await this.mailService.sendRejectionEmail(user.email, user.name || 'User', notes);
            await this.notificationsService.create(
                id,
                'Account Rejected',
                `Your account has been rejected. Reason: ${notes || 'No reason provided'}`,
                'USER_REJECTED',
            );
        }

        await this.auditLogs.log({
            actorId: adminId,
            action: approved ? 'USER_APPROVED' : 'USER_REJECTED',
            entityType: 'User',
            entityId: id,
            metadata: {
                notes: notes ?? null,
            },
        });

        return { message: `User ${approved ? 'approved' : 'rejected'} successfully` };
    }

    async getPendingApprovals(page = 1, limit = 20) {
        const where: Prisma.UserWhereInput = {
            status: ApprovalStatus.PENDING,
            role: { not: UserRole.SUPER_ADMIN },
        };

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    phone: true,
                    commercialRecord: true,
                    createdAt: true,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'asc' },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async delete(id: string) {
        await this.prisma.user.delete({ where: { id } });
        return { message: 'User deleted successfully' };
    }
}
