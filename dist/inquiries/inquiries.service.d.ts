import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class InquiriesService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(dto: CreateInquiryDto, senderId: string): Promise<{
        subject: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        senderId: string;
        listingId: string;
        receiverId: string;
    }>;
    getMyInquiries(userId: string, page?: number, limit?: number): Promise<{
        data: ({
            listing: {
                id: string;
                title: string;
            };
            sender: {
                email: string;
                name: string | null;
                phone: string | null;
                id: string;
            };
            messages: {
                id: string;
                createdAt: Date;
                content: string;
                isRead: boolean;
                inquiryId: string;
                senderId: string;
            }[];
        } & {
            subject: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            senderId: string;
            listingId: string;
            receiverId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    markAsRead(id: string, userId: string): Promise<{
        success: boolean;
    }>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    getMessages(inquiryId: string, userId: string): Promise<({
        sender: {
            name: string | null;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        isRead: boolean;
        inquiryId: string;
        senderId: string;
    })[]>;
    getInquiry(id: string, userId: string): Promise<{
        listing: {
            media: {
                url: string;
                id: string;
                createdAt: Date;
                type: string;
                listingId: string;
                isPrimary: boolean;
                order: number;
            }[];
            id: string;
            title: string;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
        };
        sender: {
            email: string;
            name: string | null;
            phone: string | null;
            id: string;
            avatar: string | null;
        };
        receiver: {
            email: string;
            name: string | null;
            phone: string | null;
            id: string;
            avatar: string | null;
        };
    } & {
        subject: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        senderId: string;
        listingId: string;
        receiverId: string;
    }>;
}
