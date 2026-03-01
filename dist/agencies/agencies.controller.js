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
exports.AgenciesController = void 0;
const common_1 = require("@nestjs/common");
const agencies_service_1 = require("./agencies.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let AgenciesController = class AgenciesController {
    agenciesService;
    constructor(agenciesService) {
        this.agenciesService = agenciesService;
    }
    async findAll(filters, page, limit) {
        await this.agenciesService.backfillMissingAgencies();
        filters.isApproved = true;
        return this.agenciesService.findAll(filters, page, limit);
    }
    async getMyAgency(userId) {
        await this.agenciesService.backfillMissingAgencies();
        return this.agenciesService.findByUserId(userId);
    }
    async findAllAdmin(filters, page, limit) {
        await this.agenciesService.backfillMissingAgencies();
        return this.agenciesService.findAll(filters, page, limit);
    }
    async remove(id) {
        return this.agenciesService.remove(id);
    }
    async findOne(id) {
        return this.agenciesService.findOne(id);
    }
    async create(dto, userId) {
        return this.agenciesService.create(dto, userId);
    }
    async update(id, dto, userId) {
        return this.agenciesService.update(id, dto, userId);
    }
    async approve(id, body) {
        return this.agenciesService.approve(id, body.approved);
    }
    async getSubAdmins(id, userId) {
        return this.agenciesService.getSubAdmins(id, userId);
    }
    async addSubAdmin(id, dto, userId) {
        return this.agenciesService.addSubAdmin(id, dto, userId);
    }
    async removeSubAdmin(id, subAdminId, userId) {
        return this.agenciesService.removeSubAdmin(id, subAdminId, userId);
    }
};
exports.AgenciesController = AgenciesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AgencyFilterDto, Number, Number]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Get)('my'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "getMyAgency", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)('admin/all'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AgencyFilterDto, Number, Number]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "remove", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.AGENCY),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateAgencyDto, String]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateAgencyDto, String]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "approve", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Get)(':id/sub-admins'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "getSubAdmins", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Post)(':id/sub-admins'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateSubAdminDto, String]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "addSubAdmin", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Delete)(':id/sub-admins/:subAdminId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('subAdminId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "removeSubAdmin", null);
exports.AgenciesController = AgenciesController = __decorate([
    (0, common_1.Controller)('agencies'),
    __metadata("design:paramtypes", [agencies_service_1.AgenciesService])
], AgenciesController);
//# sourceMappingURL=agencies.controller.js.map