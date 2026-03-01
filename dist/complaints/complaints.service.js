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
exports.ComplaintsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ComplaintsService = class ComplaintsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, authorId) {
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
    async findAll(status, page = 1, limit = 20) {
        const where = {};
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Complaint not found');
        }
        return complaint;
    }
    async update(id, dto, userId, userRole) {
        const complaint = await this.findOne(id);
        if (userRole !== 'SUPER_ADMIN' && complaint.authorId !== userId) {
            throw new common_1.ForbiddenException('Cannot update this complaint');
        }
        const updateData = {
            ...dto,
        };
        if (dto.status === client_1.ComplaintStatus.RESOLVED || dto.status === client_1.ComplaintStatus.CLOSED) {
            updateData.resolvedAt = new Date();
        }
        return this.prisma.complaint.update({
            where: { id },
            data: updateData,
        });
    }
    async getMyComplaints(userId, page = 1, limit = 20) {
        const where = { authorId: userId };
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
};
exports.ComplaintsService = ComplaintsService;
exports.ComplaintsService = ComplaintsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComplaintsService);
//# sourceMappingURL=complaints.service.js.map