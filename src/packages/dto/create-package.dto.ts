import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsBoolean, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PackageBillingType } from '@prisma/client';

export enum PackageTarget {
  ALL = 'ALL',
  AGENCY = 'AGENCY',
  SHOWROOM = 'SHOWROOM',
  TRADER = 'TRADER',
  INDIVIDUAL = 'INDIVIDUAL',
}

export class PackageFeaturesDto {
  @IsBoolean()
  @IsOptional()
  enableStories?: boolean;

  @IsBoolean()
  @IsOptional()
  enableFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  enableFeaturedPlus?: boolean;

  @IsBoolean()
  @IsOptional()
  priorityListing?: boolean;

  @IsBoolean()
  @IsOptional()
  highlightedBadge?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxListings?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxStories?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxFeaturedListings?: number;

  @IsBoolean()
  @IsOptional()
  autoApproveListings?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  durationDays?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxSubAdmins?: number;
}

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsString()
  @IsOptional()
  nameUr?: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @IsString()
  @IsOptional()
  descriptionAr?: string;

  @IsString()
  @IsOptional()
  descriptionUr?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsEnum(PackageBillingType)
  billingType: PackageBillingType;

  @IsEnum(PackageTarget)
  @IsOptional()
  targetAudience?: PackageTarget;

  @ValidateNested()
  @Type(() => PackageFeaturesDto)
  features: PackageFeaturesDto;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
