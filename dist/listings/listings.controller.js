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
exports.ListingsController = void 0;
const common_1 = require("@nestjs/common");
const listings_service_1 = require("./listings.service");
const create_listing_dto_1 = require("./dto/create-listing.dto");
const update_listing_dto_1 = require("./dto/update-listing.dto");
const update_listing_status_dto_1 = require("./dto/update-listing-status.dto");
const listing_dto_1 = require("./dto/listing.dto");
const create_offer_dto_1 = require("./dto/create-offer.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let ListingsController = class ListingsController {
    listingsService;
    constructor(listingsService) {
        this.listingsService = listingsService;
    }
    create(req, createListingDto) {
        return this.listingsService.create(req.user.id, createListingDto);
    }
    findAll(filterDto) {
        return this.listingsService.findAllPublic(filterDto);
    }
    findMyListings(req, paginationDto) {
        return this.listingsService.findMyListings(req.user.id, paginationDto.page, paginationDto.limit);
    }
    findLiked(req, paginationDto) {
        return this.listingsService.findLiked(req.user.id, paginationDto.page, paginationDto.limit);
    }
    findAllAdmin(paginationDto) {
        return this.listingsService.findAllAdmin(paginationDto.page, paginationDto.limit);
    }
    findOne(id, req) {
        return this.listingsService.findOne(id, req.user?.id);
    }
    incrementViewCount(id, ip, req) {
        return this.listingsService.incrementViewCount(id, ip, req.user?.id);
    }
    toggleLike(req, id) {
        return this.listingsService.toggleLike(req.user.id, id);
    }
    createOffer(req, id, createOfferDto) {
        return this.listingsService.createOffer(req.user.id, id, createOfferDto.amount, createOfferDto.message);
    }
    updateStatus(id, updateListingStatusDto) {
        return this.listingsService.updateStatus(id, updateListingStatusDto);
    }
    update(req, id, updateListingDto) {
        return this.listingsService.update(req.user.id, id, updateListingDto);
    }
    remove(req, id) {
        return this.listingsService.remove(req.user.id, req.user.role, id);
    }
};
exports.ListingsController = ListingsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.AGENCY, client_1.UserRole.SHOWROOM, client_1.UserRole.TRADER, client_1.UserRole.INDIVIDUAL, client_1.UserRole.SERVICE_PROVIDER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_listing_dto_1.CreateListingDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listing_dto_1.ListingFilterDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.AGENCY, client_1.UserRole.SHOWROOM, client_1.UserRole.TRADER, client_1.UserRole.INDIVIDUAL, client_1.UserRole.SERVICE_PROVIDER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findMyListings", null);
__decorate([
    (0, common_1.Get)('liked'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findLiked", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findAllAdmin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(':id/view'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Ip)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "incrementViewCount", null);
__decorate([
    (0, common_1.Post)(':id/like'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "toggleLike", null);
__decorate([
    (0, common_1.Post)(':id/offers'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_offer_dto_1.CreateOfferDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "createOffer", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_listing_status_dto_1.UpdateListingStatusDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.AGENCY, client_1.UserRole.SHOWROOM, client_1.UserRole.TRADER, client_1.UserRole.INDIVIDUAL, client_1.UserRole.SERVICE_PROVIDER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_listing_dto_1.UpdateListingDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "remove", null);
exports.ListingsController = ListingsController = __decorate([
    (0, common_1.Controller)('listings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [listings_service_1.ListingsService])
], ListingsController);
//# sourceMappingURL=listings.controller.js.map