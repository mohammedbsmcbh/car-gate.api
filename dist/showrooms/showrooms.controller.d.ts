import { ShowroomsService } from './showrooms.service';
import { CreateShowroomDto, UpdateShowroomDto, CreateSubAdminDto, ShowroomFilterDto } from './dto';
export declare class ShowroomsController {
    private showroomsService;
    constructor(showroomsService: ShowroomsService);
    findAll(filters: ShowroomFilterDto, page: number, limit: number): Promise<{
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
                        price: import("@prisma/client/runtime/library").Decimal;
                        features: import("@prisma/client/runtime/library").JsonValue;
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
                    limits: import("@prisma/client/runtime/library").JsonValue;
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
    getMyShowroom(userId: string): Promise<{
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
    getSubAdmins(id: string, userId: string): Promise<{
        email: string;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    addSubAdmin(id: string, dto: CreateSubAdminDto, userId: string): Promise<{
        email: string;
        name: string;
        id: string;
        isActive: boolean;
    }>;
    removeSubAdmin(id: string, subAdminId: string, userId: string): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
