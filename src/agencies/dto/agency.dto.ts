import { IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAgencyDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    nameAr?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    descriptionAr?: string;

    @IsString()
    @IsOptional()
    commercialRecord?: string;

    @IsString()
    @IsOptional()
    logo?: string;

    @IsString()
    @IsOptional()
    coverImage?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    latitude?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    longitude?: number;

    @IsString()
    @IsOptional()
    website?: string;
}

export class UpdateAgencyDto extends CreateAgencyDto { }

export class CreateSubAdminDto {
    @IsString()
    email: string;

    @IsString()
    name: string;

    @IsString()
    password: string;
}

export class AgencyFilterDto {
    @IsString()
    @IsOptional()
    city?: string;

    @IsBoolean()
    @IsOptional()
    isApproved?: boolean;

    @IsString()
    @IsOptional()
    search?: string;

    // Pagination params (accepted to avoid validation errors when passed via query)
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit?: number;
}
