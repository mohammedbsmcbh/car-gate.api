import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateUserDto, AdminUpdateUserDto, UserFilterDto } from './dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class UsersService {
    private prisma;
    private mailService;
    private auditLogs;
    private notificationsService;
    constructor(prisma: PrismaService, mailService: MailService, auditLogs: AuditLogsService, notificationsService: NotificationsService);
    findAll(filters: UserFilterDto, page?: number, limit?: number): Promise<{
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
    approve(id: string, adminId: string, approved: boolean, notes?: string): Promise<{
        message: string;
    }>;
    getPendingApprovals(page?: number, limit?: number): Promise<{
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
    delete(id: string): Promise<{
        message: string;
    }>;
}
