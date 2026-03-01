import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { UserRole, Language } from '@prisma/client';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @IsEnum(Language)
    preferredLanguage?: Language;
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    whatsapp?: string;

    @IsString()
    @IsOptional()
    avatar?: string;

    @IsString()
    @IsOptional()
    coverImage?: string;

    @IsString()
    @IsOptional()
    pushToken?: string;

    @IsString()
    @IsOptional()
    commercialRecord?: string;
}

export class AdminUpdateUserDto extends UpdateUserDto {
    @IsBoolean()
    @IsOptional()
    isApproved?: boolean;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}

export class UserFilterDto {
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    @IsBoolean()
    @IsOptional()
    isApproved?: boolean;

    @IsString()
    @IsOptional()
    search?: string;
}
