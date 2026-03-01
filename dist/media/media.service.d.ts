import { PrismaService } from '../prisma/prisma.service';
import { UploadMediaDto, UpdateMediaDto, ImagePosition } from './dto';
import { UserRole } from '@prisma/client';
export declare class MediaService {
    private prisma;
    constructor(prisma: PrismaService);
    uploadToCloudinary(base64Data: string, listingId: string, userId: string, userRole: UserRole, position?: ImagePosition): Promise<{
        cloudinaryId: string;
        position: ImagePosition;
        url: string;
        id: string;
        createdAt: Date;
        type: string;
        listingId: string;
        isPrimary: boolean;
        order: number;
    }>;
    uploadStoryMedia(base64Data: string, userId: string): Promise<{
        url: string;
        publicId: string;
    }>;
    uploadStoryVideoFromBuffer(file: Express.Multer.File, userId: string): Promise<{
        url: string;
        publicId: string;
    }>;
    uploadProfileImage(base64Data: string, userId: string): Promise<{
        url: string;
        publicId: string;
    }>;
    deleteFromCloudinary(publicId: string): Promise<void>;
    getUploadSignature(folder?: string): {
        signature: string;
        timestamp: number;
        cloudName: string | undefined;
        apiKey: string | undefined;
        folder: string;
    };
    upload(dto: UploadMediaDto, userId: string, userRole: UserRole): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        type: string;
        listingId: string;
        isPrimary: boolean;
        order: number;
    }>;
    findByListing(listingId: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        type: string;
        listingId: string;
        isPrimary: boolean;
        order: number;
    }[]>;
    uploadVideoToCloudinary(file: Express.Multer.File, listingId: string, userId: string, userRole: UserRole): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        type: string;
        listingId: string;
        isPrimary: boolean;
        order: number;
    }>;
    update(mediaId: string, dto: UpdateMediaDto, userId: string, userRole: UserRole): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        type: string;
        listingId: string;
        isPrimary: boolean;
        order: number;
    }>;
    remove(mediaId: string, userId: string, userRole: UserRole): Promise<{
        message: string;
    }>;
    setPrimary(mediaId: string, userId: string, userRole: UserRole): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        type: string;
        listingId: string;
        isPrimary: boolean;
        order: number;
    }>;
}
