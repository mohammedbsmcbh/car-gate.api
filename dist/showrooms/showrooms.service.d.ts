import { PrismaService } from '../prisma/prisma.service';
import { CreateShowroomDto, UpdateShowroomDto, CreateSubAdminDto, ShowroomFilterDto } from './dto';
import { Prisma } from '@prisma/client';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class ShowroomsService {
    private prisma;
    private auditLogs;
    constructor(prisma: PrismaService, auditLogs: AuditLogsService);
    create(dto: CreateShowroomDto, userId: string): Promise<{
        name: string;
        commercialRecord: string | null;
        id: string;
        coverImage: string | null;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        description: string | null;
        city: string | null;
        address: string | null;
        logo: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
        descriptionAr: string | null;
        isVerified: boolean;
    }>;
    findAll(filters: ShowroomFilterDto, page?: number, limit?: number): Promise<{
        data: {
            isFeatured: boolean;
            user: {
                name: string | null;
                phone: string | null;
                id: string;
                subscriptions: ({
                    package: {
                        id: string;
                        isActive: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        nameAr: string;
                        descriptionAr: string | null;
                        price: Prisma.Decimal;
                        features: Prisma.JsonValue;
                        sortOrder: number;
                        nameEn: string;
                        nameUr: string | null;
                        descriptionEn: string | null;
                        descriptionUr: string | null;
                        billingType: import("@prisma/client").$Enums.PackageBillingType;
                        targetAudience: import("@prisma/client").$Enums.PackageTarget;
                    };
                } & {
                    id: string;
                    status: import("@prisma/client").$Enums.SubscriptionStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    packageId: string;
                    startDate: Date;
                    endDate: Date;
                    listingsUsed: number;
                    storiesUsed: number;
                    featuredListingsUsed: number;
                    limits: Prisma.JsonValue;
                })[];
            };
            _count: {
                listings: number;
            };
            name: string;
            commercialRecord: string | null;
            id: string;
            coverImage: string | null;
            isApproved: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameAr: string | null;
            description: string | null;
            city: string | null;
            address: string | null;
            logo: string | null;
            latitude: number | null;
            longitude: number | null;
            userId: string;
            descriptionAr: string | null;
            isVerified: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            email: string;
            name: string | null;
            phone: string | null;
            whatsapp: string | null;
            id: string;
        };
        listings: ({
            media: {
                url: string;
                id: string;
                createdAt: Date;
                type: string;
                listingId: string;
                isPrimary: boolean;
                order: number;
            }[];
        } & {
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
            price: Prisma.Decimal;
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
            featuredPrice: Prisma.Decimal | null;
            featuredPriority: number;
            viewCount: number;
            likesCount: number;
            inquiryCount: number;
            approvedAt: Date | null;
            expiresAt: Date | null;
        })[];
        _count: {
            listings: number;
            subAdmins: number;
        };
        subAdmins: {
            email: string;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
        }[];
    } & {
        name: string;
        commercialRecord: string | null;
        id: string;
        coverImage: string | null;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        description: string | null;
        city: string | null;
        address: string | null;
        logo: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
        descriptionAr: string | null;
        isVerified: boolean;
    }>;
    findByUserId(userId: string): Promise<{
        _count: {
            listings: number;
        };
        subAdmins: {
            email: string;
            name: string;
            id: string;
            isActive: boolean;
        }[];
    } & {
        name: string;
        commercialRecord: string | null;
        id: string;
        coverImage: string | null;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        description: string | null;
        city: string | null;
        address: string | null;
        logo: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
        descriptionAr: string | null;
        isVerified: boolean;
    }>;
    update(id: string, dto: UpdateShowroomDto, userId: string): Promise<{
        name: string;
        commercialRecord: string | null;
        id: string;
        coverImage: string | null;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        description: string | null;
        city: string | null;
        address: string | null;
        logo: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
        descriptionAr: string | null;
        isVerified: boolean;
    }>;
    approve(id: string, approved: boolean, adminId: string): Promise<{
        name: string;
        commercialRecord: string | null;
        id: string;
        coverImage: string | null;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        description: string | null;
        city: string | null;
        address: string | null;
        logo: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
        descriptionAr: string | null;
        isVerified: boolean;
    }>;
    addSubAdmin(showroomId: string, dto: CreateSubAdminDto, userId: string): Promise<{
        email: string;
        name: string;
        id: string;
        isActive: boolean;
    }>;
    removeSubAdmin(showroomId: string, subAdminId: string, userId: string): Promise<{
        message: string;
    }>;
    getSubAdmins(showroomId: string, userId: string): Promise<{
        email: string;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
