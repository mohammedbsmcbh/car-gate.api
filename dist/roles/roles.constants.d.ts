import { UserRole } from '@prisma/client';
export { UserRole };
export declare const ROLE_HIERARCHY: {
    SUPER_ADMIN: number;
    AGENCY: number;
    SHOWROOM: number;
    TRADER: number;
    INDIVIDUAL: number;
};
export declare const ROLES_WITH_LISTINGS: UserRole[];
export declare const ADMIN_ROLES: UserRole[];
export declare const BUSINESS_ROLES: UserRole[];
