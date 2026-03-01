import { UserRole } from './roles.constants';
export declare class RolesService {
    hasHigherOrEqualRole(userRole: UserRole, requiredRole: UserRole): boolean;
    canCreateListings(role: UserRole): boolean;
    isAdmin(role: UserRole): boolean;
    isBusinessRole(role: UserRole): boolean;
    getAllRoles(): UserRole[];
    isValidRole(role: string): boolean;
}
