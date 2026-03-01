"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProvidersController = void 0;
const common_1 = require("@nestjs/common");
const service_providers_service_1 = require("./service-providers.service");
const service_provider_dto_1 = require("./dto/service-provider.dto");
const guards_1 = require("../auth/guards");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let ServiceProvidersController = class ServiceProvidersController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(type, city) {
        return this.service.findAll(type, city);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    createBooking(providerId, dto) {
        return this.service.createBooking(providerId, dto, undefined);
    }
    createServiceRequest(providerId, dto) {
        return this.service.createServiceRequest(providerId, dto, undefined);
    }
    getMyProfile(userId) {
        return this.service.findMyProfile(userId);
    }
    upsertProfile(userId, dto) {
        return this.service.upsertProfile(userId, dto);
    }
    updateProfile(userId, dto) {
        return this.service.updateProfile(userId, dto);
    }
    addService(userId, dto) {
        return this.service.addService(userId, dto);
    }
    updateService(userId, itemId, dto) {
        return this.service.updateService(userId, itemId, dto);
    }
    deleteService(userId, itemId) {
        return this.service.deleteService(userId, itemId);
    }
    getMyBookings(userId) {
        return this.service.getMyBookings(userId);
    }
    updateBookingStatus(userId, bookingId, body) {
        return this.service.updateBookingStatus(userId, bookingId, body.status);
    }
    getMyRequests(userId) {
        return this.service.getMyRequests(userId);
    }
    updateRequestStatus(userId, requestId, body) {
        return this.service.updateRequestStatus(userId, requestId, body.status);
    }
    findAllAdmin(type, approved) {
        return this.service.findAllAdmin(type, approved);
    }
    getPendingServices() {
        return this.service.getPendingServices();
    }
    approveServiceItem(itemId, body) {
        return this.service.approveServiceItem(itemId, body.approved);
    }
    approve(id, body) {
        return this.service.approve(id, body.approved);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.ServiceProvidersController = ServiceProvidersController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(':id/book'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, service_provider_dto_1.CreateBookingDto]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "createBooking", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(':id/request'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, service_provider_dto_1.CreateServiceRequestDto]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "createServiceRequest", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Get)('my/profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Post)('my/profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, service_provider_dto_1.CreateServiceProviderDto]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "upsertProfile", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Patch)('my/profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, service_provider_dto_1.UpdateServiceProviderDto]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Post)('my/services'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, service_provider_dto_1.CreateServiceItemDto]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "addService", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Patch)('my/services/:itemId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, service_provider_dto_1.UpdateServiceItemDto]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "updateService", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Delete)('my/services/:itemId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "deleteService", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Get)('my/bookings'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "getMyBookings", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Patch)('my/bookings/:bookingId/status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('bookingId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "updateBookingStatus", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Get)('my/requests'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "getMyRequests", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Patch)('my/requests/:requestId/status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('requestId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "updateRequestStatus", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)('admin/all'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('approved')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)('admin/pending-services'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "getPendingServices", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Patch)('admin/services/:itemId/approve'),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "approveServiceItem", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Patch)('admin/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "approve", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Delete)('admin/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceProvidersController.prototype, "remove", null);
exports.ServiceProvidersController = ServiceProvidersController = __decorate([
    (0, common_1.Controller)('service-providers'),
    __metadata("design:paramtypes", [service_providers_service_1.ServiceProvidersService])
], ServiceProvidersController);
//# sourceMappingURL=service-providers.controller.js.map