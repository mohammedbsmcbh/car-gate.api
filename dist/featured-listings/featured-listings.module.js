"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturedListingsModule = void 0;
const common_1 = require("@nestjs/common");
const featured_listings_controller_1 = require("./featured-listings.controller");
const featured_listings_service_1 = require("./featured-listings.service");
let FeaturedListingsModule = class FeaturedListingsModule {
};
exports.FeaturedListingsModule = FeaturedListingsModule;
exports.FeaturedListingsModule = FeaturedListingsModule = __decorate([
    (0, common_1.Module)({
        controllers: [featured_listings_controller_1.FeaturedListingsController],
        providers: [featured_listings_service_1.FeaturedListingsService],
        exports: [featured_listings_service_1.FeaturedListingsService],
    })
], FeaturedListingsModule);
//# sourceMappingURL=featured-listings.module.js.map