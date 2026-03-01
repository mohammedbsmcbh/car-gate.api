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
exports.FeaturedListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let FeaturedListingsService = class FeaturedListingsService {
    prisma;
    auditLogs;
    constructor(prisma, auditLogs) {
        this.prisma = prisma;
        this.auditLogs = auditLogs;
    }
    async create(dto, userId, userRole) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: dto.listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (userRole !== client_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only Super Admin can feature listings');
        }
        if (listing.status !== client_1.ListingStatus.APPROVED) {
        }
        const startsAt = dto.startsAt ? new Date(dto.startsAt) : new Date();
        const expiresAt = new Date(startsAt);
        expiresAt.setDate(expiresAt.getDate() + dto.days);
        const updatedListing = await this.prisma.listing.update({
            where: { id: dto.listingId },
            data: {
                isFeatured: true,
                featuredStartsAt: startsAt,
                featuredUntil: expiresAt,
                featuredPrice: dto.price,
                featuredPriority: dto.priority ?? 0,
            },
            include: {
                media: true,
                owner: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        await this.auditLogs.log({
            actorId: userId,
            action: 'FEATURED_ACTIVATED',
            entityType: 'Listing',
            entityId: dto.listingId,
            metadata: {
                startsAt: startsAt.toISOString(),
                expiresAt: expiresAt.toISOString(),
                price: dto.price ?? null,
                priority: dto.priority ?? 0,
            },
        });
        return updatedListing;
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.listing.findMany({
                where: {
                    isFeatured: true,
                    featuredUntil: {
                        gte: new Date(),
                    },
                    status: client_1.ListingStatus.APPROVED,
                },
                include: {
                    media: { where: { isPrimary: true }, take: 1 },
                    owner: {
                        select: { id: true, name: true },
                    },
                    agency: {
                        select: { id: true, name: true, logo: true },
                    },
                    showroom: {
                        select: { id: true, name: true, logo: true },
                    },
                },
                skip,
                take: limit,
                orderBy: [
                    { featuredPriority: 'desc' },
                    { featuredUntil: 'desc' },
                    { createdAt: 'desc' },
                ],
            }),
            this.prisma.listing.count({
                where: {
                    isFeatured: true,
                    featuredUntil: {
                        gte: new Date(),
                    },
                    status: client_1.ListingStatus.APPROVED,
                },
            }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                media: true,
                owner: {
                    select: { id: true, name: true, phone: true, email: true },
                },
                agency: true,
                showroom: true,
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (!listing.isFeatured) {
            throw new common_1.BadRequestException('This listing is not featured');
        }
        return listing;
    }
    async update(listingId, dto, userId, userRole) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (userRole !== client_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only Super Admin can update featured listings');
        }
        const updateData = {};
        if (dto.isActive !== undefined) {
            updateData.isFeatured = dto.isActive;
            if (!dto.isActive) {
                updateData.featuredUntil = null;
                updateData.featuredPrice = null;
            }
        }
        if (dto.expiresAt) {
            updateData.featuredUntil = new Date(dto.expiresAt);
        }
        if (dto.priority !== undefined) {
            updateData.featuredPriority = dto.priority;
        }
        const updated = await this.prisma.listing.update({
            where: { id: listingId },
            data: updateData,
        });
        await this.auditLogs.log({
            actorId: userId,
            action: 'FEATURED_UPDATED',
            entityType: 'Listing',
            entityId: listingId,
            metadata: {
                isActive: dto.isActive ?? null,
                expiresAt: dto.expiresAt ?? null,
                priority: dto.priority ?? null,
            },
        });
        return updated;
    }
    async remove(listingId, userId, userRole) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (userRole !== client_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only Super Admin can remove featured status');
        }
        await this.prisma.listing.update({
            where: { id: listingId },
            data: {
                isFeatured: false,
                featuredStartsAt: null,
                featuredUntil: null,
                featuredPrice: null,
                featuredPriority: 0,
            },
        });
        await this.auditLogs.log({
            actorId: userId,
            action: 'FEATURED_REMOVED',
            entityType: 'Listing',
            entityId: listingId,
        });
        return { message: 'Featured status removed successfully' };
    }
    async cleanupExpired() {
        const result = await this.prisma.listing.updateMany({
            where: {
                isFeatured: true,
                featuredUntil: {
                    lt: new Date(),
                },
            },
            data: {
                isFeatured: false,
                featuredStartsAt: null,
                featuredPriority: 0,
            },
        });
        return { count: result.count };
    }
};
exports.FeaturedListingsService = FeaturedListingsService;
exports.FeaturedListingsService = FeaturedListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_logs_service_1.AuditLogsService])
], FeaturedListingsService);
//# sourceMappingURL=featured-listings.service.js.map