import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomsClearerDto } from './dto/create-customs-clearer.dto';
export declare class CustomsClearersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createdById: string, dto: CreateCustomsClearerDto): Promise<{
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
}
