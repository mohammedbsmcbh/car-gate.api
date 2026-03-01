import { Injectable } from '@nestjs/common';
import { UserRole, ROLE_HIERARCHY, ROLES_WITH_LISTINGS, ADMIN_ROLES, BUSINESS_ROLES } from './roles.constants';

@Injectable()
export class RolesService {
  /**
   * Check if a role has higher or equal hierarchy level than another
   */
  hasHigherOrEqualRole(userRole: UserRole, requiredRole: UserRole): boolean {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
  }

  /**
   * Check if a role can create listings
   */
  canCreateListings(role: UserRole): boolean {
    return ROLES_WITH_LISTINGS.includes(role);
  }

  /**
   * Check if a role is an admin role
   */
  isAdmin(role: UserRole): boolean {
    return ADMIN_ROLES.includes(role);
  }

  /**
   * Check if a role is a business role (requires commercial record)
   */
  isBusinessRole(role: UserRole): boolean {
    return BUSINESS_ROLES.includes(role);
  }

  /**
   * Get all available roles
   */
  getAllRoles(): UserRole[] {
    return Object.values(UserRole);
  }

  /**
   * Validate if a role exists
   */
  isValidRole(role: string): boolean {
    return Object.values(UserRole).includes(role as UserRole);
  }
}
