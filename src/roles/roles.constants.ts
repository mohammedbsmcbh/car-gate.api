import { UserRole } from '@prisma/client';

export { UserRole };

export const ROLE_HIERARCHY = {
  [UserRole.SUPER_ADMIN]: 5,
  [UserRole.AGENCY]: 3,
  [UserRole.SHOWROOM]: 3,
  [UserRole.TRADER]: 2,
  [UserRole.INDIVIDUAL]: 1,
};

export const ROLES_WITH_LISTINGS: UserRole[] = [
  UserRole.AGENCY,
  UserRole.SHOWROOM,
  UserRole.TRADER,
  UserRole.INDIVIDUAL,
];

export const ADMIN_ROLES: UserRole[] = [UserRole.SUPER_ADMIN];

export const BUSINESS_ROLES: UserRole[] = [
  UserRole.AGENCY,
  UserRole.SHOWROOM,
  UserRole.TRADER,
];
