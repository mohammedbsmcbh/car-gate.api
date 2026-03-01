import { BannerMediaType, BannerPosition, Language } from '@prisma/client';
export declare class CreateBannerDto {
    title: string;
    language?: Language;
    mediaUrl: string;
    mediaType?: BannerMediaType;
    link?: string;
    isActive?: boolean;
    sortOrder?: number;
    position?: BannerPosition;
}
