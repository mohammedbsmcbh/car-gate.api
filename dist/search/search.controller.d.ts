import { SearchService } from './search.service';
import { SearchListingsDto, SearchQueryDto, NearbySearchDto } from './dto';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchListings(dto: SearchListingsDto): Promise<{
        data: ({
            agency: {
                name: string;
                id: string;
                logo: string | null;
            } | null;
            showroom: {
                name: string;
                id: string;
                logo: string | null;
            } | null;
            media: {
                url: string;
                id: string;
                createdAt: Date;
                type: string;
                listingId: string;
                isPrimary: boolean;
                order: number;
            }[];
            owner: {
                name: string | null;
                id: string;
            };
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    searchAgencies(dto: SearchQueryDto): Promise<{
        data: ({
            _count: {
                listings: number;
            };
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
            website: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    searchShowrooms(dto: SearchQueryDto): Promise<{
        data: ({
            _count: {
                listings: number;
            };
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    globalSearch(dto: SearchQueryDto): Promise<{
        listings: ({
            agency: {
                name: string;
                id: string;
                logo: string | null;
            } | null;
            showroom: {
                name: string;
                id: string;
                logo: string | null;
            } | null;
            media: {
                url: string;
                id: string;
                createdAt: Date;
                type: string;
                listingId: string;
                isPrimary: boolean;
                order: number;
            }[];
            owner: {
                name: string | null;
                id: string;
            };
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
        agencies: ({
            _count: {
                listings: number;
            };
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
            website: string | null;
        })[];
        showrooms: ({
            _count: {
                listings: number;
            };
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
        })[];
        totals: {
            listings: number;
            agencies: number;
            showrooms: number;
        };
    }>;
    searchNearby(dto: NearbySearchDto): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
