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
exports.OffersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let OffersService = class OffersService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(userId, createOfferDto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: createOfferDto.listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.ownerId === userId) {
            throw new common_1.ForbiddenException('You cannot make an offer on your own listing');
        }
        const offer = await this.prisma.offer.create({
            data: {
                amount: createOfferDto.amount,
                message: createOfferDto.message,
                status: client_1.OfferStatus.PENDING,
                userId,
                listingId: createOfferDto.listingId,
            },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        media: true,
                        currency: true,
                    },
                },
            },
        });
        await this.notificationsService.notifyUser(listing.ownerId, 'OFFER_RECEIVED', {
            amount: `${offer.listing.currency} ${offer.amount.toLocaleString()}`,
            listingTitle: offer.listing.title,
            offerId: offer.id,
        }, { type: 'SYSTEM' });
        return offer;
    }
    async findAllByUser(userId) {
        return this.prisma.offer.findMany({
            where: { userId },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        media: true,
                        currency: true,
                        ownerId: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllReceived(userId) {
        const listings = await this.prisma.listing.findMany({
            where: { ownerId: userId },
            select: { id: true },
        });
        const listingIds = listings.map((l) => l.id);
        return this.prisma.offer.findMany({
            where: {
                listingId: { in: listingIds },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                listing: {
                    select: {
                        id: true,
                        title: true,
                        media: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const offer = await this.prisma.offer.findUnique({
            where: { id },
            include: {
                listing: true,
                user: true,
            },
        });
        if (!offer) {
            throw new common_1.NotFoundException('Offer not found');
        }
        return offer;
    }
    async updateStatus(id, userId, updateOfferStatusDto) {
        const offer = await this.findOne(id);
        if (offer.listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to update this offer');
        }
        const updatedOffer = await this.prisma.offer.update({
            where: { id },
            data: { status: updateOfferStatusDto.status },
        });
        if (updateOfferStatusDto.status === client_1.OfferStatus.ACCEPTED) {
            await this.notificationsService.notifyUser(offer.userId, 'OFFER_ACCEPTED', {
                listingTitle: offer.listing.title,
                offerId: offer.id,
            }, { type: 'SYSTEM' });
        }
        else if (updateOfferStatusDto.status === client_1.OfferStatus.REJECTED) {
            await this.notificationsService.notifyUser(offer.userId, 'OFFER_REJECTED', {
                listingTitle: offer.listing.title,
                offerId: offer.id,
            }, { type: 'SYSTEM' });
        }
        return updatedOffer;
    }
};
exports.OffersService = OffersService;
exports.OffersService = OffersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], OffersService);
//# sourceMappingURL=offers.service.js.map