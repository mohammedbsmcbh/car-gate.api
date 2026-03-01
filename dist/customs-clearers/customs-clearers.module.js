"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomsClearersModule = void 0;
const common_1 = require("@nestjs/common");
const customs_clearers_controller_1 = require("./customs-clearers.controller");
const customs_clearers_service_1 = require("./customs-clearers.service");
const prisma_module_1 = require("../prisma/prisma.module");
let CustomsClearersModule = class CustomsClearersModule {
};
exports.CustomsClearersModule = CustomsClearersModule;
exports.CustomsClearersModule = CustomsClearersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [customs_clearers_controller_1.CustomsClearersController],
        providers: [customs_clearers_service_1.CustomsClearersService],
    })
], CustomsClearersModule);
//# sourceMappingURL=customs-clearers.module.js.map