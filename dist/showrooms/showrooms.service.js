"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowroomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let ShowroomsService = class ShowroomsService {
    prisma;
    auditLogs;
    constructor(prisma, auditLogs) {
        this.prisma = prisma;
        this.auditLogs = auditLogs;
    }
    async create(dto, userId) {
        const existing = await this.prisma.showroom.findUnique({
            where: { userId },
        });
        if (existing) {
            throw new common_1.ConflictException('User already has a showroom');
        }
        const showroom = await this.prisma.showroom.create({
            data: {
                ...dto,
                userId,
            },
        });
        return showroom;
    }
    async findAll(filters, page = 1, limit = 20) {
        const where = {};
        if (filters.city) {
            where.city = { contains: filters.city, mode: 'insensitive' };
        }
        if (filters.isApproved !== undefined) {
            where.isApproved = filters.isApproved;
        }
        if (filters.isVerified !== undefined) {
            where.isVerified = filters.isVerified;
        }
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { nameAr: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        const [showrooms, total] = await Promise.all([
            this.prisma.showroom.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            subscriptions: {
                                where: {
                                    status: 'ACTIVE',
                                    endDate: { gt: new Date() },
                                },
                                include: {
                                    package: true
                                },
                                take: 1
                            }
                        },
                    },
                    _count: {
                        select: { listings: true },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.showroom.count({ where }),
        ]);
        const mappedShowrooms = showrooms.map((showroom) => {
            const activeSub = showroom.user.subscriptions?.[0];
            const features = activeSub?.package?.features;
            const isFeatured = !!features?.priorityListing;
            return {
                ...showroom,
                isFeatured
            };
        });
        const sortedShowrooms = mappedShowrooms.sort((a, b) => {
            if (a.isFeatured && !b.isFeatured)
                return -1;
            if (!a.isFeatured && b.isFeatured)
                return 1;
            return 0;
        });
        return {
            data: sortedShowrooms,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const showroom = await this.prisma.showroom.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, phone: true, whatsapp: true, email: true },
                },
                subAdmins: {
                    select: { id: true, name: true, email: true, isActive: true, createdAt: true },
                },
                listings: {
                    where: { status: client_1.ListingStatus.APPROVED },
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
        if (!showroom) {
            throw new common_1.NotFoundException('Showroom not found');
        }
        return showroom;
    }
    async findByUserId(userId) {
        const showroom = await this.prisma.showroom.findFirst({
            where: {
                OR: [
                    { userId: userId },
                    { subAdmins: { some: { id: userId } } }
                ]
            },
            include: {
                subAdmins: {
                    select: { id: true, email: true, name: true, isActive: true },
                },
                _count: {
                    select: { listings: true },
                },
            },
        });
        if (!showroom) {
            throw new common_1.NotFoundException('Showroom not found');
        }
        return showroom;
    }
    async update(id, dto, userId) {
        const showroom = await this.prisma.showroom.findUnique({
            where: { id },
        });
        if (!showroom) {
            throw new common_1.NotFoundException('Showroom not found');
        }
        if (showroom.userId !== userId) {
            throw new common_1.ForbiddenException('Cannot update this showroom');
        }
        return this.prisma.showroom.update({
            where: { id },
            data: dto,
        });
    }
    async approve(id, approved, adminId) {
        const showroom = await this.prisma.showroom.update({
            where: { id },
            data: { isApproved: approved },
        });
        await this.prisma.user.update({
            where: { id: showroom.userId },
            data: {
                isApproved: approved,
                isActive: approved ? true : undefined
            },
        });
        await this.auditLogs.log({
            actorId: adminId,
            action: approved ? 'SHOWROOM_APPROVED' : 'SHOWROOM_REJECTED',
            entityType: 'Showroom',
            entityId: id,
            metadata: { userId: showroom.userId },
        });
        return showroom;
    }
    async addSubAdmin(showroomId, dto, userId) {
        const showroom = await this.prisma.showroom.findUnique({
            where: { id: showroomId },
        });
        if (!showroom || showroom.userId !== userId) {
            throw new common_1.ForbiddenException('Cannot manage this showroom');
        }
        try {
            const hashedPassword = await bcrypt.hash(dto.password, 10);
            const subAdmin = await this.prisma.showroomSubAdmin.create({
                data: {
                    showroomId,
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
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('A team member with this email already exists');
            }
            throw error;
        }
    }
    async removeSubAdmin(showroomId, subAdminId, userId) {
        const showroom = await this.prisma.showroom.findUnique({
            where: { id: showroomId },
        });
        if (!showroom || showroom.userId !== userId) {
            throw new common_1.ForbiddenException('Cannot manage this showroom');
        }
        await this.prisma.showroomSubAdmin.delete({
            where: { id: subAdminId },
        });
        return { message: 'Sub-admin removed successfully' };
    }
    async getSubAdmins(showroomId, userId) {
        const showroom = await this.prisma.showroom.findUnique({
            where: { id: showroomId },
            include: { subAdmins: true },
        });
        if (!showroom) {
            throw new common_1.ForbiddenException('Showroom not found');
        }
        const isOwner = showroom.userId === userId;
        const isSubAdmin = showroom.subAdmins.some(sa => sa.id === userId);
        if (!isOwner && !isSubAdmin) {
            throw new common_1.ForbiddenException('Cannot view this showroom');
        }
        return this.prisma.showroomSubAdmin.findMany({
            where: { showroomId },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                createdAt: true,
            },
        });
    }
    async remove(id) {
        const showroom = await this.prisma.showroom.findUnique({
            where: { id },
        });
        if (!showroom) {
            throw new common_1.NotFoundException('Showroom not found');
        }
        await this.prisma.showroom.delete({
            where: { id },
        });
        return { message: 'Showroom deleted successfully' };
    }
};
exports.ShowroomsService = ShowroomsService;
exports.ShowroomsService = ShowroomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_logs_service_1.AuditLogsService])
], ShowroomsService);
//# sourceMappingURL=showrooms.service.js.map