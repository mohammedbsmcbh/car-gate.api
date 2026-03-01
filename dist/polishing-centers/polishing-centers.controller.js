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
exports.PolishingCentersController = void 0;
const common_1 = require("@nestjs/common");
const polishing_centers_service_1 = require("./polishing-centers.service");
const create_polishing_center_dto_1 = require("./dto/create-polishing-center.dto");
const update_polishing_center_dto_1 = require("./dto/update-polishing-center.dto");
const guards_1 = require("../auth/guards");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const client_1 = require("@prisma/client");
let PolishingCentersController = class PolishingCentersController {
    polishingCentersService;
    constructor(polishingCentersService) {
        this.polishingCentersService = polishingCentersService;
    }
    findAll() {
        return this.polishingCentersService.findAll();
    }
    findAllAdmin() {
        return this.polishingCentersService.findAllAdmin();
    }
    findOne(id) {
        return this.polishingCentersService.findOne(id);
    }
    create(createPolishingCenterDto) {
        return this.polishingCentersService.create(createPolishingCenterDto);
    }
    update(id, updatePolishingCenterDto) {
        return this.polishingCentersService.update(id, updatePolishingCenterDto);
    }
    remove(id) {
        return this.polishingCentersService.remove(id);
    }
};
exports.PolishingCentersController = PolishingCentersController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PolishingCentersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PolishingCentersController.prototype, "findAllAdmin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PolishingCentersController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_polishing_center_dto_1.CreatePolishingCenterDto]),
    __metadata("design:returntype", void 0)
], PolishingCentersController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_polishing_center_dto_1.UpdatePolishingCenterDto]),
    __metadata("design:returntype", void 0)
], PolishingCentersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PolishingCentersController.prototype, "remove", null);
exports.PolishingCentersController = PolishingCentersController = __decorate([
    (0, common_1.Controller)('polishing-centers'),
    __metadata("design:paramtypes", [polishing_centers_service_1.PolishingCentersService])
], PolishingCentersController);
//# sourceMappingURL=polishing-centers.controller.js.map