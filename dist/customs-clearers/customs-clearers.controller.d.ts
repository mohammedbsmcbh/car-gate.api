import { CustomsClearersService } from './customs-clearers.service';
import { CreateCustomsClearerDto } from './dto/create-customs-clearer.dto';
export declare class CustomsClearersController {
    private readonly customsClearersService;
    constructor(customsClearersService: CustomsClearersService);
    findAllPublic(): import("@prisma/client").Prisma.PrismaPromise<{
        email: string | null;
        name: string;
        phone: string;
        whatsapp: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        city: string | null;
        address: string | null;
        imageUrl: string | null;
        createdById: string;
    }[]>;
    create(userId: string, dto: CreateCustomsClearerDto): Promise<{
        email: string | null;
        name: string;
        phone: string;
        whatsapp: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        city: string | null;
        address: string | null;
        imageUrl: string | null;
        createdById: string;
    }>;
}
