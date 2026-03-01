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
exports.InquiriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let InquiriesService = class InquiriesService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(dto, senderId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: dto.listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const sender = await this.prisma.user.findUnique({ where: { id: senderId } });
        let inquiry = await this.prisma.inquiry.findFirst({
            where: {
                listingId: dto.listingId,
                senderId,
                receiverId: listing.ownerId,
            },
        });
        if (!inquiry) {
            inquiry = await this.prisma.inquiry.create({
                data: {
                    listingId: dto.listingId,
                    senderId,
                    receiverId: listing.ownerId,
                    subject: `Inquiry about ${listing.title}`,
                },
            });
        }
        await this.prisma.inquiryMessage.create({
            data: {
                inquiryId: inquiry.id,
                senderId,
                content: dto.message,
            },
        });
        await this.prisma.listing.update({
            where: { id: dto.listingId },
            data: { inquiryCount: { increment: 1 } },
        });
        await this.notificationsService.notifyUser(listing.ownerId, 'CHAT_NEW_MESSAGE', { senderName: sender?.name || 'User', inquiryId: inquiry.id }, { type: 'CHAT' });
        return inquiry;
    }
    async getMyInquiries(userId, page = 1, limit = 20) {
        const [inquiries, total] = await Promise.all([
            this.prisma.inquiry.findMany({
                where: {
                    OR: [
                        { receiverId: userId },
                        { senderId: userId }
                    ]
                },
                include: {
                    listing: {
                        select: { id: true, title: true },
                    },
                    sender: {
                        select: { id: true, name: true, email: true, phone: true },
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { updatedAt: 'desc' },
            }),
            this.prisma.inquiry.count({
                where: {
                    OR: [
                        { receiverId: userId },
                        { senderId: userId }
                    ]
                }
            }),
        ]);
        return {
            data: inquiries,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async markAsRead(id, userId) {
        return { success: true };
    }
    async getUnreadCount(userId) {
        return { count: 0 };
    }
    async getMessages(inquiryId, userId) {
        const inquiry = await this.prisma.inquiry.findUnique({
            where: { id: inquiryId },
        });
        if (!inquiry) {
            throw new common_1.NotFoundException('Inquiry not found');
        }
        if (inquiry.senderId !== userId && inquiry.receiverId !== userId) {
            throw new common_1.NotFoundException('Inquiry not found');
        }
        return this.prisma.inquiryMessage.findMany({
            where: { inquiryId },
            include: {
                sender: {
                    select: { id: true, name: true, avatar: true },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async getInquiry(id, userId) {
        const inquiry = await this.prisma.inquiry.findUnique({
            where: { id },
            include: {
                listing: {
                    select: { id: true, title: true, price: true, currency: true, media: { take: 1 } },
                },
                sender: {
                    select: { id: true, name: true, email: true, phone: true, avatar: true },
                },
                receiver: {
                    select: { id: true, name: true, email: true, phone: true, avatar: true },
                },
            },
        });
        if (!inquiry) {
            throw new common_1.NotFoundException('Inquiry not found');
        }
        if (inquiry.senderId !== userId && inquiry.receiverId !== userId) {
            throw new common_1.NotFoundException('Inquiry not found');
        }
        return inquiry;
    }
};
exports.InquiriesService = InquiriesService;
exports.InquiriesService = InquiriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], InquiriesService);
//# sourceMappingURL=inquiries.service.js.map