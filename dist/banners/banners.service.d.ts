import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class BannersService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    private inferMediaTypeFromUrl;
    create(dto: CreateBannerDto): Promise<{
        link: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        language: import("@prisma/client").$Enums.Language;
        title: string;
        sortOrder: number;
        position: import("@prisma/client").$Enums.BannerPosition;
        mediaUrl: string;
        mediaType: import("@prisma/client").$Enums.BannerMediaType;
    }>;
    findAll(activeOnly?: boolean, language?: string): import("@prisma/client").Prisma.PrismaPromise<{
        link: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        language: import("@prisma/client").$Enums.Language;
        title: string;
        sortOrder: number;
        position: import("@prisma/client").$Enums.BannerPosition;
        mediaUrl: string;
        mediaType: import("@prisma/client").$Enums.BannerMediaType;
    }[]>;
    findOne(id: string): Promise<{
        link: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        language: import("@prisma/client").$Enums.Language;
        title: string;
        sortOrder: number;
        position: import("@prisma/client").$Enums.BannerPosition;
        mediaUrl: string;
        mediaType: import("@prisma/client").$Enums.BannerMediaType;
    }>;
    update(id: string, dto: UpdateBannerDto): Promise<{
        link: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        language: import("@prisma/client").$Enums.Language;
        title: string;
        sortOrder: number;
        position: import("@prisma/client").$Enums.BannerPosition;
        mediaUrl: string;
        mediaType: import("@prisma/client").$Enums.BannerMediaType;
    }>;
    remove(id: string): Promise<{
        link: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        language: import("@prisma/client").$Enums.Language;
        title: string;
        sortOrder: number;
        position: import("@prisma/client").$Enums.BannerPosition;
        mediaUrl: string;
        mediaType: import("@prisma/client").$Enums.BannerMediaType;
    }>;
}
