"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUSINESS_ROLES = exports.ADMIN_ROLES = exports.ROLES_WITH_LISTINGS = exports.ROLE_HIERARCHY = exports.UserRole = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return client_1.UserRole; } });
exports.ROLE_HIERARCHY = {
    [client_1.UserRole.SUPER_ADMIN]: 5,
    [client_1.UserRole.AGENCY]: 3,
    [client_1.UserRole.SHOWROOM]: 3,
    [client_1.UserRole.TRADER]: 2,
    [client_1.UserRole.INDIVIDUAL]: 1,
};
exports.ROLES_WITH_LISTINGS = [
    client_1.UserRole.AGENCY,
    client_1.UserRole.SHOWROOM,
    client_1.UserRole.TRADER,
    client_1.UserRole.INDIVIDUAL,
];
exports.ADMIN_ROLES = [client_1.UserRole.SUPER_ADMIN];
exports.BUSINESS_ROLES = [
    client_1.UserRole.AGENCY,
    client_1.UserRole.SHOWROOM,
    client_1.UserRole.TRADER,
];
//# sourceMappingURL=roles.constants.js.map