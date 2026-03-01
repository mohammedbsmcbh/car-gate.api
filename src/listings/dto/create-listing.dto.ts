import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ListingType } from '@prisma/client';

export class CreateListingDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    titleAr?: string;

    @IsString()
    @IsOptional()
    descriptionAr?: string;

    @IsEnum(ListingType)
    type: ListingType;

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
    @Min(1900)
    year?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(0)
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

    @IsString()
    @IsOptional()
    features?: string; // JSON string or comma-separated

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    images?: string[];
}
