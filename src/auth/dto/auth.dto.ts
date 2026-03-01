import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole, ServiceProviderType, Language } from '@prisma/client';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    commercialRecord?: string;

    @IsString()
    @IsOptional()
    whatsapp?: string;

    @IsEnum(ServiceProviderType)
    @IsOptional()
    serviceProviderType?: ServiceProviderType;

    @IsEnum(Language)
    @IsOptional()
    preferredLanguage?: Language;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class AuthResponseDto {
    user: {
        id: string;
        email: string;
        name: string | null;
        role: UserRole;
        isApproved: boolean;
    };
    accessToken: string;
}

export class RegistrationSuccessDto {
    success: boolean;
    message: string;
    requiresApproval: boolean;
}

export class ForgotPasswordDto {
    @IsEmail()
    email: string;
}

export class VerifyOtpDto {
    @IsEmail()
    email: string;

    @IsString()
    otp: string;
}

export class ResetPasswordDto {
    @IsEmail()
    email: string;

    @IsString()
    otp: string;

    @IsString()
    @MinLength(6)
    newPassword: string;
}
