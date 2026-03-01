import { IsString, IsEnum, IsBoolean, IsOptional, IsInt, Min } from 'class-validator';
import { BannerMediaType, BannerPosition, Language } from '@prisma/client';

export class CreateBannerDto {
  @IsString()
  title: string;

  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @IsString()
  mediaUrl: string;

  @IsEnum(BannerMediaType)
  @IsOptional()
  mediaType?: BannerMediaType;

  @IsString()
  @IsOptional()
  link?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @IsEnum(BannerPosition)
  @IsOptional()
  position?: BannerPosition;
}

