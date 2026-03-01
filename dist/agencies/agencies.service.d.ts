import { PrismaService } from '../prisma/prisma.service';
import { CreateAgencyDto, UpdateAgencyDto, CreateSubAdminDto, AgencyFilterDto } from './dto';
import { Prisma } from '@prisma/client';
export declare class AgenciesService {
    private prisma;
    constructor(prisma: PrismaService);
    backfillMissingAgencies(): Promise<void>;
    create(dto: CreateAgencyDto, userId: string): Promise<{
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
    }>;
    findAll(filters: AgencyFilterDto, page?: number, limit?: number): Promise<{
        data: ({
            user: {
                email: string;
                name: string | null;
                phone: string | null;
                id: string;
                isActive: boolean;
            };
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
    findOne(id: string): Promise<{
        user: {
            email: string;
            name: string | null;
            phone: string | null;
            whatsapp: string | null;
            id: string;
            isActive: boolean;
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
        website: string | null;
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
        website: string | null;
    }>;
    update(id: string, dto: UpdateAgencyDto, userId: string): Promise<{
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
    }>;
    approve(id: string, approved: boolean): Promise<{
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
    }>;
    addSubAdmin(agencyId: string, dto: CreateSubAdminDto, userId: string): Promise<{
        email: string;
        name: string;
        id: string;
        isActive: boolean;
    }>;
    removeSubAdmin(agencyId: string, subAdminId: string, userId: string): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getSubAdmins(agencyId: string, userId: string): Promise<{
        email: string;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
    }[]>;
}
