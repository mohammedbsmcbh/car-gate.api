import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferStatusDto } from './dto/update-offer.dto';
export declare class OffersService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(userId: string, createOfferDto: CreateOfferDto): Promise<{
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
    } & {
        id: string;
        status: import("@prisma/client").$Enums.OfferStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        message: string | null;
        listingId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAllByUser(userId: string): Promise<({
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
            ownerId: string;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.OfferStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        message: string | null;
        listingId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findAllReceived(userId: string): Promise<({
        user: {
            email: string;
            name: string | null;
            phone: string | null;
            id: string;
        };
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
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.OfferStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        message: string | null;
        listingId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            email: string;
            password: string;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            phone: string | null;
            commercialRecord: string | null;
            whatsapp: string | null;
            preferredLanguage: import("@prisma/client").$Enums.Language;
            otp: string | null;
            id: string;
            avatar: string | null;
            coverImage: string | null;
            pushToken: string | null;
            otpExpiresAt: Date | null;
            isApproved: boolean;
            status: import("@prisma/client").$Enums.ApprovalStatus;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        listing: {
            year: number | null;
            id: string;
            status: import("@prisma/client").$Enums.ListingStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            type: import("@prisma/client").$Enums.ListingType;
            description: string | null;
            city: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
            showroomId: string | null;
            descriptionAr: string | null;
            agencyId: string | null;
            title: string;
            titleAr: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            make: string | null;
            model: string | null;
            mileage: number | null;
            color: string | null;
            condition: string | null;
            transmission: string | null;
            fuelType: string | null;
            bodyType: string | null;
            engineSize: string | null;
            plateNumber: string | null;
            plateCategory: string | null;
            contactPhone: string | null;
            contactWhatsapp: string | null;
            contactEmail: string | null;
            isFeatured: boolean;
            ownerId: string;
            featuredStartsAt: Date | null;
            featuredUntil: Date | null;
            featuredPrice: import("@prisma/client/runtime/library").Decimal | null;
            featuredPriority: number;
            viewCount: number;
            likesCount: number;
            inquiryCount: number;
            approvedAt: Date | null;
            expiresAt: Date | null;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.OfferStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        message: string | null;
        listingId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateStatus(id: string, userId: string, updateOfferStatusDto: UpdateOfferStatusDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.OfferStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        message: string | null;
        listingId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
}
