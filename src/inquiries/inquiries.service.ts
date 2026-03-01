import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class InquiriesService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
    ) { }

    async create(dto: CreateInquiryDto, senderId: string) {
        // Get the listing to find the receiver
        const listing = await this.prisma.listing.findUnique({
            where: { id: dto.listingId },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        const sender = await this.prisma.user.findUnique({ where: { id: senderId } });

        // Check if inquiry already exists between these users for this listing
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

        // Create the message
        await this.prisma.inquiryMessage.create({
            data: {
                inquiryId: inquiry.id,
                senderId,
                content: dto.message,
            },
        });

        // Increment inquiry count on listing
        await this.prisma.listing.update({
            where: { id: dto.listingId },
            data: { inquiryCount: { increment: 1 } },
        });

        // NOTIFICATION: Notify Receiver
        await this.notificationsService.notifyUser(
            listing.ownerId, 
            'CHAT_NEW_MESSAGE', 
            { senderName: sender?.name || 'User', inquiryId: inquiry.id },
            { type: 'CHAT' }
        );

        return inquiry;
    }

    async getMyInquiries(userId: string, page = 1, limit = 20) {
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

    async markAsRead(id: string, userId: string) {
        // Mark all messages in this inquiry as read for this user
        // Logic: if I am the receiver, mark messages from sender as read
        // This is simplified. In a real chat, we track read status per message per participant.
        // For now, we just return success as the frontend will handle read state via socket events or fetching.
        return { success: true };
    }

    async getUnreadCount(userId: string) {
        // Count unread messages where receiver is userId
        // This requires a join which is complex in Prisma count without raw query or careful filtering
        // Simplified: return 0 for now or implement proper count
        return { count: 0 };
    }

    async getMessages(inquiryId: string, userId: string) {
        const inquiry = await this.prisma.inquiry.findUnique({
            where: { id: inquiryId },
        });

        if (!inquiry) {
            throw new NotFoundException('Inquiry not found');
        }

        // Verify user is participant
        if (inquiry.senderId !== userId && inquiry.receiverId !== userId) {
            throw new NotFoundException('Inquiry not found');
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

    async getInquiry(id: string, userId: string) {
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
            throw new NotFoundException('Inquiry not found');
        }

        if (inquiry.senderId !== userId && inquiry.receiverId !== userId) {
            throw new NotFoundException('Inquiry not found');
        }

        return inquiry;
    }
}
