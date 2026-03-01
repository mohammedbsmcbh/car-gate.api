import { UserRole, ServiceProviderType, Language } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    password: string;
    name?: string;
    role: UserRole;
    phone?: string;
    commercialRecord?: string;
    whatsapp?: string;
    serviceProviderType?: ServiceProviderType;
    preferredLanguage?: Language;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthResponseDto {
    user: {
        id: string;
        email: string;
        name: string | null;
        role: UserRole;
        isApproved: boolean;
    };
    accessToken: string;
}
export declare class RegistrationSuccessDto {
    success: boolean;
    message: string;
    requiresApproval: boolean;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class VerifyOtpDto {
    email: string;
    otp: string;
}
export declare class ResetPasswordDto {
    email: string;
    otp: string;
    newPassword: string;
}
