import { MediaService } from './media.service';
import { UploadMediaDto, UpdateMediaDto, CloudinarySignatureDto, ImagePosition } from './dto';
import { UserRole } from '@prisma/client';
interface CloudinaryUploadBody {
    image: string;
    listingId: string;
    position?: ImagePosition;
}
interface ProfileImageUploadBody {
    image: string;
}
export declare class MediaController {
    private mediaService;
    constructor(mediaService: MediaService);
    uploadToCloudinary(body: CloudinaryUploadBody, userId: string, userRole: UserRole): Promise<{
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
    uploadStoryMedia(body: ProfileImageUploadBody, userId: string): Promise<{
        url: string;
        publicId: string;
    }>;
    uploadStoryVideo(file: Express.Multer.File, userId: string): Promise<{
        url: string;
        publicId: string;
    }>;
    uploadProfileImage(body: ProfileImageUploadBody, userId: string): Promise<{
        url: string;
        publicId: string;
    }>;
    uploadVideoToCloudinary(file: Express.Multer.File, listingId: string, userId: string, userRole: UserRole): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        type: string;
        listingId: string;
        isPrimary: boolean;
        order: number;
    }>;
    getCloudinarySignature(dto: CloudinarySignatureDto): Promise<{
        signature: string;
        timestamp: number;
        cloudName: string | undefined;
        apiKey: string | undefined;
        folder: string;
    }>;
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
    update(id: string, dto: UpdateMediaDto, userId: string, userRole: UserRole): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        type: string;
        listingId: string;
        isPrimary: boolean;
        order: number;
    }>;
    setPrimary(id: string, userId: string, userRole: UserRole): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        type: string;
        listingId: string;
        isPrimary: boolean;
        order: number;
    }>;
    remove(id: string, userId: string, userRole: UserRole): Promise<{
        message: string;
    }>;
}
export {};
