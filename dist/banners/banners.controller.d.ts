import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    create(createBannerDto: CreateBannerDto): Promise<{
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
    findAll(active?: string, lang?: string): import("@prisma/client").Prisma.PrismaPromise<{
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
    update(id: string, updateBannerDto: UpdateBannerDto): Promise<{
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
