"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let UsersService = class UsersService {
    prisma;
    mailService;
    auditLogs;
    notificationsService;
    constructor(prisma, mailService, auditLogs, notificationsService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.auditLogs = auditLogs;
        this.notificationsService = notificationsService;
    }
    async findAll(filters, page = 1, limit = 20) {
        const where = {};
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async update(id, dto, currentUserId) {
        if (id !== currentUserId) {
            throw new common_1.ForbiddenException('Cannot update other users');
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
    async adminUpdate(id, dto) {
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
    async approve(id, adminId, approved, notes) {
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
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id },
                data: {
                    isApproved: approved,
                    status: approved ? client_1.ApprovalStatus.APPROVED : client_1.ApprovalStatus.REJECTED
                },
            });
            if (user.role === client_1.UserRole.AGENCY) {
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
            if (user.role === client_1.UserRole.SHOWROOM) {
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
        await this.prisma.adminApproval.create({
            data: {
                targetId: id,
                adminId,
                status: approved ? client_1.ApprovalStatus.APPROVED : client_1.ApprovalStatus.REJECTED,
                notes,
            },
        });
        if (approved) {
            await this.mailService.sendApprovalEmail(user.email, user.name || 'User');
            await this.notificationsService.create(id, 'Account Approved', 'Your account has been approved. You can now access all features.', 'USER_APPROVED');
        }
        else {
            await this.mailService.sendRejectionEmail(user.email, user.name || 'User', notes);
            await this.notificationsService.create(id, 'Account Rejected', `Your account has been rejected. Reason: ${notes || 'No reason provided'}`, 'USER_REJECTED');
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
        const where = {
            status: client_1.ApprovalStatus.PENDING,
            role: { not: client_1.UserRole.SUPER_ADMIN },
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
    async delete(id) {
        await this.prisma.user.delete({ where: { id } });
        return { message: 'User deleted successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        audit_logs_service_1.AuditLogsService,
        notifications_service_1.NotificationsService])
], UsersService);
//# sourceMappingURL=users.service.js.map