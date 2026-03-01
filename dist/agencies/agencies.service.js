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
exports.AgenciesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AgenciesService = class AgenciesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async backfillMissingAgencies() {
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
        if (usersMissingAgency.length === 0)
            return;
        for (const u of usersMissingAgency) {
            const name = (u.name?.trim() || u.email);
            if (u.role === 'AGENCY') {
                await this.prisma.agency.create({
                    data: {
                        userId: u.id,
                        name: name,
                        commercialRecord: u.commercialRecord ?? null,
                        isApproved: u.isApproved,
                    }
                }).catch(() => { });
            }
            else if (u.role === 'SHOWROOM') {
                await this.prisma.showroom.create({
                    data: {
                        userId: u.id,
                        name: name,
                        commercialRecord: u.commercialRecord ?? null,
                        isApproved: u.isApproved,
                    }
                }).catch(() => { });
            }
        }
    }
    async create(dto, userId) {
        const existing = await this.prisma.agency.findUnique({
            where: { userId },
        });
        if (existing) {
            throw new common_1.ConflictException('User already has an agency');
        }
        const agency = await this.prisma.agency.create({
            data: {
                ...dto,
                userId,
            },
        });
        return agency;
    }
    async findAll(filters, page = 1, limit = 20) {
        const where = {};
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Agency not found');
        }
        return agency;
    }
    async findByUserId(userId) {
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
            throw new common_1.NotFoundException('Agency not found');
        }
        return agency;
    }
    async update(id, dto, userId) {
        const agency = await this.prisma.agency.findUnique({
            where: { id },
        });
        if (!agency) {
            throw new common_1.NotFoundException('Agency not found');
        }
        if (agency.userId !== userId) {
            throw new common_1.ForbiddenException('Cannot update this agency');
        }
        return this.prisma.agency.update({
            where: { id },
            data: dto,
        });
    }
    async approve(id, approved) {
        const agency = await this.prisma.agency.update({
            where: { id },
            data: { isApproved: approved },
        });
        await this.prisma.user.update({
            where: { id: agency.userId },
            data: {
                isApproved: approved,
                isActive: approved ? true : undefined
            },
        });
        return agency;
    }
    async addSubAdmin(agencyId, dto, userId) {
        const agency = await this.prisma.agency.findUnique({
            where: { id: agencyId },
        });
        if (!agency || agency.userId !== userId) {
            throw new common_1.ForbiddenException('Cannot manage this agency');
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
    async removeSubAdmin(agencyId, subAdminId, userId) {
        const agency = await this.prisma.agency.findUnique({
            where: { id: agencyId },
        });
        if (!agency || agency.userId !== userId) {
            throw new common_1.ForbiddenException('Cannot manage this agency');
        }
        await this.prisma.agencySubAdmin.delete({
            where: { id: subAdminId },
        });
        return { message: 'Sub-admin removed successfully' };
    }
    async remove(id) {
        const agency = await this.prisma.agency.findUnique({
            where: { id },
        });
        if (!agency) {
            throw new common_1.NotFoundException('Agency not found');
        }
        await this.prisma.agency.delete({
            where: { id },
        });
        return { message: 'Agency deleted successfully' };
    }
    async getSubAdmins(agencyId, userId) {
        const agency = await this.prisma.agency.findUnique({
            where: { id: agencyId },
        });
        if (!agency || agency.userId !== userId) {
            throw new common_1.ForbiddenException('Cannot view this agency');
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
};
exports.AgenciesService = AgenciesService;
exports.AgenciesService = AgenciesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgenciesService);
//# sourceMappingURL=agencies.service.js.map