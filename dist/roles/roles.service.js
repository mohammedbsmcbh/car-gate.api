"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const roles_constants_1 = require("./roles.constants");
let RolesService = class RolesService {
    hasHigherOrEqualRole(userRole, requiredRole) {
        return roles_constants_1.ROLE_HIERARCHY[userRole] >= roles_constants_1.ROLE_HIERARCHY[requiredRole];
    }
    canCreateListings(role) {
        return roles_constants_1.ROLES_WITH_LISTINGS.includes(role);
    }
    isAdmin(role) {
        return roles_constants_1.ADMIN_ROLES.includes(role);
    }
    isBusinessRole(role) {
        return roles_constants_1.BUSINESS_ROLES.includes(role);
    }
    getAllRoles() {
        return Object.values(roles_constants_1.UserRole);
    }
    isValidRole(role) {
        return Object.values(roles_constants_1.UserRole).includes(role);
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)()
], RolesService);
//# sourceMappingURL=roles.service.js.map