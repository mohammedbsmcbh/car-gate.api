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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    configService;
    prisma;
    constructor(configService, prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwt.secret') || 'default-secret-key',
        });
        this.configService = configService;
        this.prisma = prisma;
    }
    async validate(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isApproved: true,
                isActive: true,
            },
        });
        if (user) {
            if (!user.isActive)
                throw new common_1.UnauthorizedException('User is inactive');
            return user;
        }
        const subAdmin = await this.prisma.showroomSubAdmin.findUnique({
            where: { id: payload.sub },
            include: {
                showroom: true
            }
        });
        if (subAdmin) {
            if (!subAdmin.isActive)
                throw new common_1.UnauthorizedException('User is inactive');
            return {
                id: subAdmin.showroom.userId,
                subAdminId: subAdmin.id,
                email: subAdmin.email,
                name: subAdmin.name,
                role: 'SHOWROOM',
                isApproved: true,
                isActive: subAdmin.isActive,
                isSubAdmin: true,
                showroomId: subAdmin.showroomId
            };
        }
        const agencySubAdmin = await this.prisma.agencySubAdmin.findUnique({
            where: { id: payload.sub },
            include: {
                agency: true
            }
        });
        if (agencySubAdmin) {
            if (!agencySubAdmin.isActive)
                throw new common_1.UnauthorizedException('User is inactive');
            return {
                id: agencySubAdmin.agency.userId,
                subAdminId: agencySubAdmin.id,
                email: agencySubAdmin.email,
                name: agencySubAdmin.name,
                role: 'AGENCY',
                isApproved: true,
                isActive: agencySubAdmin.isActive,
                isSubAdmin: true,
                agencyId: agencySubAdmin.agencyId
            };
        }
        throw new common_1.UnauthorizedException('User not found or inactive');
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map