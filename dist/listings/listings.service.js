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
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
const mail_service_1 = require("../mail/mail.service");
let ListingsService = class ListingsService {
    prisma;
    notificationsService;
    mailService;
    constructor(prisma, notificationsService, mailService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.mailService = mailService;
    }
    async create(userId, createListingDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { agency: true, showroom: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { images, ...listingData } = createListingDto;
        const mediaData = images?.length
            ? images.map((url, index) => ({
                url,
                type: 'image',
                order: index,
                isPrimary: index === 0,
            }))
            : undefined;
        const basicData = {
            ...listingData,
            ownerId: userId,
            status: client_1.ListingStatus.PENDING,
            media: mediaData ? { create: mediaData } : undefined,
        };
        if (user.role === client_1.UserRole.AGENCY && user.agency) {
            return this.prisma.listing.create({
                data: {
                    ...basicData,
                    agencyId: user.agency.id,
                }
            });
        }
        else if (user.role === client_1.UserRole.SHOWROOM && user.showroom) {
            return this.prisma.listing.create({
                data: {
                    ...basicData,
                    showroomId: user.showroom.id,
                }
            });
        }
        return this.prisma.listing.create({
            data: basicData,
        });
    }
    async findAllPublic(filters = {}) {
        const { page = 1, limit = 20, category, type, condition, search, make, model, priceMin, priceMax, yearMin, yearMax, sortBy, ownerRole, minFeaturedPriority, maxFeaturedPriority, isFeatured, ownerId, agencyId, showroomId } = filters;
        let skip = (page - 1) * limit;
        const where = {
            status: client_1.ListingStatus.APPROVED,
        };
        if (condition) {
            if (condition.toUpperCase() === 'NEW') {
                where.AND = [
                    {
                        OR: [
                            { condition: { equals: 'NEW', mode: 'insensitive' } },
                            { condition: null }
                        ]
                    }
                ];
            }
            else {
                where.condition = { equals: condition, mode: 'insensitive' };
            }
        }
        if (minFeaturedPriority !== undefined || maxFeaturedPriority !== undefined) {
            const filter = where.featuredPriority || {};
            if (minFeaturedPriority !== undefined)
                filter.gte = minFeaturedPriority;
            if (maxFeaturedPriority !== undefined)
                filter.lte = maxFeaturedPriority;
            where.featuredPriority = filter;
        }
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }
        if (category) {
            where.bodyType = { equals: category, mode: 'insensitive' };
        }
        if (type) {
            where.type = type;
        }
        if (ownerId) {
            where.ownerId = ownerId;
        }
        if (agencyId) {
            where.agencyId = agencyId;
        }
        if (showroomId) {
            where.showroomId = showroomId;
        }
        if (ownerRole) {
            const normalizedRole = ownerRole.toString().toUpperCase();
            if (normalizedRole === 'MARKET') {
                where.owner = { role: { in: [client_1.UserRole.INDIVIDUAL, client_1.UserRole.TRADER] } };
                where.type = 'CAR';
                where.AND = [
                    ...(where.AND || []),
                    {
                        OR: [
                            { bodyType: null },
                            { bodyType: { notIn: ['Luxury', 'Classic', 'Other', 'Heavy', 'luxury', 'classic', 'other', 'heavy'] } }
                        ]
                    }
                ];
            }
            else if (normalizedRole in client_1.UserRole) {
                const roleEnum = client_1.UserRole[normalizedRole];
                where.owner = { role: roleEnum };
            }
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { make: { contains: search, mode: 'insensitive' } },
                { model: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (make) {
            where.make = { equals: make, mode: 'insensitive' };
        }
        if (model) {
            where.model = { equals: model, mode: 'insensitive' };
        }
        if (priceMin || priceMax) {
            where.price = {};
            if (priceMin)
                where.price.gte = priceMin;
            if (priceMax)
                where.price.lte = priceMax;
        }
        if (yearMin || yearMax) {
            where.year = {};
            if (yearMin)
                where.year.gte = yearMin;
            if (yearMax)
                where.year.lte = yearMax;
        }
        let orderBy = { createdAt: 'desc' };
        if (sortBy === 'random') {
            const count = await this.prisma.listing.count({ where });
            if (count > limit) {
                const maxSkip = count - limit;
                skip = Math.floor(Math.random() * (maxSkip + 1));
            }
            orderBy = undefined;
        }
        const [data, total] = await Promise.all([
            this.prisma.listing.findMany({
                where,
                include: {
                    agency: {
                        select: {
                            id: true,
                            name: true,
                            logo: true,
                        },
                    },
                    showroom: {
                        select: {
                            id: true,
                            name: true,
                            logo: true,
                        },
                    },
                    media: true,
                },
                skip,
                take: limit,
                orderBy,
            }),
            this.prisma.listing.count({ where }),
        ]);
        if (sortBy === 'random') {
            for (let i = data.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [data[i], data[j]] = [data[j], data[i]];
            }
        }
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
    async incrementViewCount(id, ip, userId) {
        const recentView = await this.prisma.listingView.findFirst({
            where: {
                listingId: id,
                OR: [
                    { ip: ip },
                    userId ? { userId: userId } : {},
                ],
                createdAt: {
                    gt: new Date(Date.now() - 60 * 60 * 1000),
                },
            },
        });
        if (recentView) {
            const listing = await this.prisma.listing.findUnique({
                where: { id },
                select: { viewCount: true },
            });
            return listing;
        }
        await this.prisma.listingView.create({
            data: {
                listingId: id,
                ip,
                userId,
            },
        });
        return this.prisma.listing.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    }
    async toggleLike(userId, listingId) {
        const existingLike = await this.prisma.like.findUnique({
            where: {
                userId_listingId: {
                    userId,
                    listingId,
                },
            },
        });
        if (existingLike) {
            const [_, listing] = await this.prisma.$transaction([
                this.prisma.like.delete({
                    where: { id: existingLike.id },
                }),
                this.prisma.listing.update({
                    where: { id: listingId },
                    data: { likesCount: { decrement: 1 } },
                }),
            ]);
            return { liked: false, likesCount: listing.likesCount };
        }
        else {
            const [_, listing] = await this.prisma.$transaction([
                this.prisma.like.create({
                    data: {
                        userId,
                        listingId,
                    },
                }),
                this.prisma.listing.update({
                    where: { id: listingId },
                    data: { likesCount: { increment: 1 } },
                }),
            ]);
            return { liked: true, likesCount: listing.likesCount };
        }
    }
    async createOffer(userId, listingId, amount, message) {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Offer amount must be greater than 0');
        }
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.ownerId === userId) {
            throw new common_1.ForbiddenException('You cannot make an offer on your own listing');
        }
        const offer = await this.prisma.offer.create({
            data: {
                amount,
                message,
                userId,
                listingId,
                status: client_1.OfferStatus.PENDING,
            },
        });
        console.log(`Notification: New offer of ${amount} for listing ${listingId} by user ${userId}`);
        return offer;
    }
    async findMyListings(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { agency: true, showroom: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const whereClause = {
            OR: [
                { ownerId: userId },
            ]
        };
        if (user.agency) {
            whereClause.OR.push({ agencyId: user.agency.id });
        }
        if (user.showroom) {
            whereClause.OR.push({ showroomId: user.showroom.id });
        }
        const [data, total] = await Promise.all([
            this.prisma.listing.findMany({
                where: whereClause,
                include: {
                    media: true,
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.listing.count({
                where: whereClause,
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
    async findAllAdmin(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.listing.findMany({
                include: {
                    agency: {
                        select: { name: true },
                    },
                    showroom: {
                        select: { name: true },
                    },
                    owner: {
                        select: { name: true, email: true, role: true }
                    },
                    media: {
                        orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
                        take: 3,
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.listing.count(),
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
    async findOne(id, userId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                agency: true,
                showroom: true,
                media: true,
                owner: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        whatsapp: true,
                        role: true,
                    },
                },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        let isLiked = false;
        if (userId) {
            const like = await this.prisma.like.findUnique({
                where: {
                    userId_listingId: {
                        userId,
                        listingId: id,
                    },
                },
            });
            isLiked = !!like;
        }
        return { ...listing, isLiked };
    }
    async update(userId, listingId, updateListingDto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own listings');
        }
        const { images, ...data } = updateListingDto;
        if (images) {
            await this.prisma.media.deleteMany({
                where: { listingId },
            });
            if (images.length > 0) {
                await this.prisma.media.createMany({
                    data: images.map((url, index) => ({
                        listingId,
                        url,
                        type: 'image',
                        order: index,
                    })),
                });
            }
        }
        return this.prisma.listing.update({
            where: { id: listingId },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }
    async updateStatus(id, dto) {
        const status = dto.status === 'APPROVED' ? client_1.ListingStatus.APPROVED : client_1.ListingStatus.REJECTED;
        const listingWithOwner = await this.prisma.listing.findUnique({
            where: { id },
            include: { owner: { select: { email: true, name: true } } },
        });
        const listing = await this.prisma.listing.update({
            where: { id },
            data: { status: status },
        });
        if (status === client_1.ListingStatus.APPROVED) {
            await this.notificationsService.notifyUser(listing.ownerId, 'LISTING_APPROVED', { listingTitle: listing.title }, { type: 'SYSTEM' });
            if (listingWithOwner?.owner?.email) {
                this.mailService.sendListingApprovedEmail(listingWithOwner.owner.email, listingWithOwner.owner.name || '', listing.title || '', listing.id).catch(() => null);
            }
        }
        else if (status === client_1.ListingStatus.REJECTED) {
            await this.notificationsService.notifyUser(listing.ownerId, 'LISTING_REJECTED', { listingTitle: listing.title }, { type: 'SYSTEM' });
            if (listingWithOwner?.owner?.email) {
                this.mailService.sendListingRejectedEmail(listingWithOwner.owner.email, listingWithOwner.owner.name || '', listing.title || '').catch(() => null);
            }
        }
        return listing;
    }
    async findLiked(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [likes, total] = await Promise.all([
            this.prisma.like.findMany({
                where: { userId },
                include: {
                    listing: {
                        include: {
                            agency: true,
                            showroom: true,
                            media: true,
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.like.count({ where: { userId } }),
        ]);
        const data = likes.map(like => ({
            ...like.listing,
            isLiked: true,
        }));
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
    async remove(userId, userRole, id) {
        const listing = await this.findOne(id);
        if (userRole !== client_1.UserRole.SUPER_ADMIN && listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own listings');
        }
        return this.prisma.listing.delete({
            where: { id },
        });
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        mail_service_1.MailService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map