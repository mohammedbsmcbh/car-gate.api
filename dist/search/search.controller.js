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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const search_service_1 = require("./search.service");
const dto_1 = require("./dto");
let SearchController = class SearchController {
    searchService;
    constructor(searchService) {
        this.searchService = searchService;
    }
    async searchListings(dto) {
        const { q, page = 1, limit = 20, ...filters } = dto;
        return this.searchService.searchListings(q || '', filters, page, limit);
    }
    async searchAgencies(dto) {
        console.log('Search Agencies DTO:', dto);
        const { q = '', page = 1, limit = 20 } = dto;
        return this.searchService.searchAgencies(q, page, limit);
    }
    async searchShowrooms(dto) {
        const { q = '', page = 1, limit = 20 } = dto;
        return this.searchService.searchShowrooms(q, page, limit);
    }
    async globalSearch(dto) {
        const { q = '', page = 1, limit = 10 } = dto;
        return this.searchService.globalSearch(q, page, limit);
    }
    async searchNearby(dto) {
        const { latitude, longitude, radiusKm = 10, page = 1, limit = 20 } = dto;
        return this.searchService.searchNearby(latitude, longitude, radiusKm, page, limit);
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)('listings'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SearchListingsDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchListings", null);
__decorate([
    (0, common_1.Get)('agencies'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SearchQueryDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchAgencies", null);
__decorate([
    (0, common_1.Get)('showrooms'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SearchQueryDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchShowrooms", null);
__decorate([
    (0, common_1.Get)('global'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SearchQueryDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "globalSearch", null);
__decorate([
    (0, common_1.Get)('nearby'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.NearbySearchDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchNearby", null);
exports.SearchController = SearchController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map