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
exports.ShowroomsController = void 0;
const common_1 = require("@nestjs/common");
const showrooms_service_1 = require("./showrooms.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let ShowroomsController = class ShowroomsController {
    showroomsService;
    constructor(showroomsService) {
        this.showroomsService = showroomsService;
    }
    async findAll(filters, page, limit) {
        return this.showroomsService.findAll(filters, page, limit);
    }
    async getMyShowroom(userId) {
        return this.showroomsService.findByUserId(userId);
    }
    async findOne(id) {
        return this.showroomsService.findOne(id);
    }
    async create(dto, userId) {
        return this.showroomsService.create(dto, userId);
    }
    async update(id, dto, userId) {
        return this.showroomsService.update(id, dto, userId);
    }
    async approve(id, approved, adminId) {
        return this.showroomsService.approve(id, approved, adminId);
    }
    async getSubAdmins(id, userId) {
        return this.showroomsService.getSubAdmins(id, userId);
    }
    async addSubAdmin(id, dto, userId) {
        return this.showroomsService.addSubAdmin(id, dto, userId);
    }
    async removeSubAdmin(id, subAdminId, userId) {
        return this.showroomsService.removeSubAdmin(id, subAdminId, userId);
    }
    async remove(id) {
        return this.showroomsService.remove(id);
    }
};
exports.ShowroomsController = ShowroomsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ShowroomFilterDto, Number, Number]),
    __metadata("design:returntype", Promise)
], ShowroomsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SHOWROOM),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShowroomsController.prototype, "getMyShowroom", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShowroomsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SHOWROOM),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateShowroomDto, String]),
    __metadata("design:returntype", Promise)
], ShowroomsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SHOWROOM),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateShowroomDto, String]),
    __metadata("design:returntype", Promise)
], ShowroomsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('approved')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, String]),
    __metadata("design:returntype", Promise)
], ShowroomsController.prototype, "approve", null);
__decorate([
    (0, common_1.Get)(':id/sub-admins'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SHOWROOM),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ShowroomsController.prototype, "getSubAdmins", null);
__decorate([
    (0, common_1.Post)(':id/sub-admins'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SHOWROOM),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateSubAdminDto, String]),
    __metadata("design:returntype", Promise)
], ShowroomsController.prototype, "addSubAdmin", null);
__decorate([
    (0, common_1.Delete)(':id/sub-admins/:subAdminId'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SHOWROOM),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('subAdminId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ShowroomsController.prototype, "removeSubAdmin", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShowroomsController.prototype, "remove", null);
exports.ShowroomsController = ShowroomsController = __decorate([
    (0, common_1.Controller)('showrooms'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [showrooms_service_1.ShowroomsService])
], ShowroomsController);
//# sourceMappingURL=showrooms.controller.js.map