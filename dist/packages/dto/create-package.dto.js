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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePackageDto = exports.PackageFeaturesDto = exports.PackageTarget = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
var PackageTarget;
(function (PackageTarget) {
    PackageTarget["ALL"] = "ALL";
    PackageTarget["AGENCY"] = "AGENCY";
    PackageTarget["SHOWROOM"] = "SHOWROOM";
    PackageTarget["TRADER"] = "TRADER";
    PackageTarget["INDIVIDUAL"] = "INDIVIDUAL";
})(PackageTarget || (exports.PackageTarget = PackageTarget = {}));
class PackageFeaturesDto {
    enableStories;
    enableFeatured;
    enableFeaturedPlus;
    priorityListing;
    highlightedBadge;
    maxListings;
    maxStories;
    maxFeaturedListings;
    autoApproveListings;
    durationDays;
    maxSubAdmins;
}
exports.PackageFeaturesDto = PackageFeaturesDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PackageFeaturesDto.prototype, "enableStories", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PackageFeaturesDto.prototype, "enableFeatured", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PackageFeaturesDto.prototype, "enableFeaturedPlus", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PackageFeaturesDto.prototype, "priorityListing", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PackageFeaturesDto.prototype, "highlightedBadge", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PackageFeaturesDto.prototype, "maxListings", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PackageFeaturesDto.prototype, "maxStories", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PackageFeaturesDto.prototype, "maxFeaturedListings", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PackageFeaturesDto.prototype, "autoApproveListings", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PackageFeaturesDto.prototype, "durationDays", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PackageFeaturesDto.prototype, "maxSubAdmins", void 0);
class CreatePackageDto {
    nameEn;
    nameAr;
    nameUr;
    descriptionEn;
    descriptionAr;
    descriptionUr;
    price;
    billingType;
    targetAudience;
    features;
    isActive;
    sortOrder;
}
exports.CreatePackageDto = CreatePackageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "nameEn", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "nameAr", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "nameUr", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "descriptionEn", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "descriptionAr", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "descriptionUr", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePackageDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.PackageBillingType),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "billingType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PackageTarget),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "targetAudience", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PackageFeaturesDto),
    __metadata("design:type", PackageFeaturesDto)
], CreatePackageDto.prototype, "features", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePackageDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePackageDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=create-package.dto.js.map