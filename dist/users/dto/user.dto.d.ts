import { UserRole, Language } from '@prisma/client';
export declare class UpdateUserDto {
    preferredLanguage?: Language;
    name?: string;
    phone?: string;
    whatsapp?: string;
    avatar?: string;
    coverImage?: string;
    pushToken?: string;
    commercialRecord?: string;
}
export declare class AdminUpdateUserDto extends UpdateUserDto {
    isApproved?: boolean;
    isActive?: boolean;
    role?: UserRole;
}
export declare class UserFilterDto {
    role?: UserRole;
    isApproved?: boolean;
    search?: string;
}
