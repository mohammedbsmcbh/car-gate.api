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
exports.FeaturedListingsController = void 0;
const common_1 = require("@nestjs/common");
const featured_listings_service_1 = require("./featured-listings.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let FeaturedListingsController = class FeaturedListingsController {
    featuredListingsService;
    constructor(featuredListingsService) {
        this.featuredListingsService = featuredListingsService;
    }
    async findAll(page, limit) {
        return this.featuredListingsService.findAll(page, limit);
    }
    async findOne(id) {
        return this.featuredListingsService.findOne(id);
    }
    async create(dto, userId, userRole) {
        return this.featuredListingsService.create(dto, userId, userRole);
    }
    async update(listingId, dto, userId, userRole) {
        return this.featuredListingsService.update(listingId, dto, userId, userRole);
    }
    async remove(listingId, userId, userRole) {
        return this.featuredListingsService.remove(listingId, userId, userRole);
    }
    async cleanupExpired() {
        return this.featuredListingsService.cleanupExpired();
    }
};
exports.FeaturedListingsController = FeaturedListingsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FeaturedListingsController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeaturedListingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateFeaturedListingDto, String, String]),
    __metadata("design:returntype", Promise)
], FeaturedListingsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':listingId'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('listingId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateFeaturedListingDto, String, String]),
    __metadata("design:returntype", Promise)
], FeaturedListingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':listingId'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('listingId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FeaturedListingsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeaturedListingsController.prototype, "cleanupExpired", null);
exports.FeaturedListingsController = FeaturedListingsController = __decorate([
    (0, common_1.Controller)('featured-listings'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [featured_listings_service_1.FeaturedListingsService])
], FeaturedListingsController);
//# sourceMappingURL=featured-listings.controller.js.map