import { UsersService } from './users.service';
import { UpdateUserDto, AdminUpdateUserDto, UserFilterDto } from './dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getMe(userId: string): Promise<{
        agency: {
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
        } | null;
        showroom: {
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
        } | null;
        email: string;
        name: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        commercialRecord: string | null;
        whatsapp: string | null;
        id: string;
        avatar: string | null;
        coverImage: string | null;
        isApproved: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMe(dto: UpdateUserDto, userId: string): Promise<{
        email: string;
        name: string | null;
        phone: string | null;
        whatsapp: string | null;
        id: string;
        avatar: string | null;
        coverImage: string | null;
    }>;
    registerPushToken(body: {
        pushToken: string;
        preferredLanguage?: 'EN' | 'AR' | 'UR';
    }, userId: string): Promise<{
        email: string;
        name: string | null;
        phone: string | null;
        whatsapp: string | null;
        id: string;
        avatar: string | null;
        coverImage: string | null;
    }>;
    findAll(filters: UserFilterDto, page: number, limit: number): Promise<{
        data: {
            email: string;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            phone: string | null;
            id: string;
            isApproved: boolean;
            isActive: boolean;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getPendingApprovals(page: number, limit: number): Promise<{
        data: {
            email: string;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            phone: string | null;
            commercialRecord: string | null;
            id: string;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        agency: {
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
        } | null;
        showroom: {
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
        } | null;
        email: string;
        name: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        commercialRecord: string | null;
        whatsapp: string | null;
        id: string;
        avatar: string | null;
        coverImage: string | null;
        isApproved: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto, currentUserId: string): Promise<{
        email: string;
        name: string | null;
        phone: string | null;
        whatsapp: string | null;
        id: string;
        avatar: string | null;
        coverImage: string | null;
    }>;
    adminUpdate(id: string, dto: AdminUpdateUserDto): Promise<{
        email: string;
        name: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        isApproved: boolean;
        isActive: boolean;
    }>;
    approve(id: string, body: {
        approved: boolean;
        notes?: string;
    }, adminId: string): Promise<{
        message: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
