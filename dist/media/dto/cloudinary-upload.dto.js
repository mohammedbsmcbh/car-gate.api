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
exports.CloudinarySignatureDto = exports.CloudinaryUploadDto = exports.ImagePosition = void 0;
const class_validator_1 = require("class-validator");
var ImagePosition;
(function (ImagePosition) {
    ImagePosition["FRONT"] = "front";
    ImagePosition["BACK"] = "back";
    ImagePosition["SIDE"] = "side";
    ImagePosition["OTHER"] = "other";
})(ImagePosition || (exports.ImagePosition = ImagePosition = {}));
class CloudinaryUploadDto {
    listingId;
    position;
}
exports.CloudinaryUploadDto = CloudinaryUploadDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CloudinaryUploadDto.prototype, "listingId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ImagePosition),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CloudinaryUploadDto.prototype, "position", void 0);
class CloudinarySignatureDto {
    folder;
}
exports.CloudinarySignatureDto = CloudinarySignatureDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CloudinarySignatureDto.prototype, "folder", void 0);
//# sourceMappingURL=cloudinary-upload.dto.js.map