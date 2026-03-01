import {
    IsString,
    IsOptional,
    IsEnum,
    IsNumber,
    IsBoolean,
    IsArray,
    Min,
    Max,
    Allow,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ListingType, ListingStatus, UserRole } from '@prisma/client';

export class CreateListingDto {
    @IsEnum(ListingType)
    type: ListingType;

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    titleAr?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    descriptionAr?: string;

    @IsNumber()
    @Type(() => Number)
    @Min(0)
    price: number;

    @IsString()
    @IsOptional()
    currency?: string;

    // Vehicle fields
    @IsString()
    @IsOptional()
    make?: string;

    @IsString()
    @IsOptional()
    model?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    year?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    mileage?: number;

    @IsString()
    @IsOptional()
    color?: string;

    @IsString()
    @IsOptional()
    condition?: string;

    @IsString()
    @IsOptional()
    transmission?: string;

    @IsString()
    @IsOptional()
    fuelType?: string;

    @IsString()
    @IsOptional()
    bodyType?: string;

    @IsString()
    @IsOptional()
    engineSize?: string;

    // Plate fields
    @IsString()
    @IsOptional()
    plateNumber?: string;

    @IsString()
    @IsOptional()
    plateCategory?: string;

    // Location
    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    latitude?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    longitude?: number;

    // Contact
    @IsString()
    @IsOptional()
    contactPhone?: string;

    @IsString()
    @IsOptional()
    contactWhatsapp?: string;

    @IsString()
    @IsOptional()
    contactEmail?: string;

    // Media URLs
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    images?: string[];
}

export class UpdateListingDto extends CreateListingDto {
    @IsEnum(ListingStatus)
    @IsOptional()
    status?: ListingStatus;
}

export class ListingFilterDto {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit?: number;

    @IsString()
    @IsOptional()
    category?: string;

    @IsEnum(ListingType)
    @IsOptional()
    type?: ListingType;

    @IsEnum(ListingStatus)
    @IsOptional()
    status?: ListingStatus;

    @IsString()
    @IsOptional()
    make?: string;

    @IsString()
    @IsOptional()
    model?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    yearMin?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    yearMax?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    priceMin?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    priceMax?: number;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    condition?: string;

@IsString()
        @IsOptional()
        ownerRole?: string;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    isFeatured?: boolean;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    minFeaturedPriority?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    maxFeaturedPriority?: number;

    @IsString()
    @IsOptional()
    search?: string;

    @IsString()
    @IsOptional()
    ownerId?: string;

    @IsString()
    @IsOptional()
    agencyId?: string;

    @IsString()
    @IsOptional()
    showroomId?: string;

    // Location-based search
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    latitude?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    longitude?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Max(100)
    radiusKm?: number;

    // Sorting
    @IsString()
    @IsOptional()
    sortBy?: 'price' | 'createdAt' | 'year' | 'mileage' | 'random';

    @IsString()
    @IsOptional()
    sortOrder?: 'asc' | 'desc';
}

export class FeatureListingDto {
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    days: number;
}
