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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("./settings.service");
const guards_1 = require("../auth/guards");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const upsert_setting_dto_1 = require("./dto/upsert-setting.dto");
const featured_pricing_dto_1 = require("./dto/featured-pricing.dto");
let SettingsController = class SettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async listFeaturedPricing() {
        return this.settingsService.listFeaturedPricing(true);
    }
    async listFeaturedPricingAdmin() {
        return this.settingsService.listFeaturedPricing(false);
    }
    async createFeaturedPricing(dto, adminId) {
        return this.settingsService.createFeaturedPricing(dto, adminId);
    }
    async updateFeaturedPricing(id, dto, adminId) {
        return this.settingsService.updateFeaturedPricing(id, dto, adminId);
    }
    async listSettings() {
        return this.settingsService.listSettings();
    }
    async getSetting(key) {
        return this.settingsService.getSetting(key);
    }
    async upsertSetting(key, dto, adminId) {
        return this.settingsService.upsertSetting(key, dto, adminId);
    }
    async getPublicSetting(key) {
        if (!key)
            return { message: 'Missing key' };
        const setting = await this.settingsService.getSetting(key);
        return setting ?? { key, value: null };
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('featured-pricing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "listFeaturedPricing", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)('admin/featured-pricing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "listFeaturedPricingAdmin", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Post)('admin/featured-pricing'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [featured_pricing_dto_1.CreateFeaturedPricingDto, String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "createFeaturedPricing", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Patch)('admin/featured-pricing/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, featured_pricing_dto_1.UpdateFeaturedPricingDto, String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateFeaturedPricing", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)('admin/settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "listSettings", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)('admin/settings/:key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getSetting", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Patch)('admin/settings/:key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upsert_setting_dto_1.UpsertSettingDto, String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "upsertSetting", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('settings'),
    __param(0, (0, common_1.Query)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getPublicSetting", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map