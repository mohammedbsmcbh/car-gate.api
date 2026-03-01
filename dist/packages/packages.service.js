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
exports.PackagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PackagesService = class PackagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPackageDto) {
        const orConditions = [
            { nameEn: { equals: createPackageDto.nameEn, mode: 'insensitive' } },
            { nameAr: { equals: createPackageDto.nameAr, mode: 'insensitive' } },
        ];
        if (createPackageDto.nameUr) {
            orConditions.push({ nameUr: { equals: createPackageDto.nameUr, mode: 'insensitive' } });
        }
        const existing = await this.prisma.package.findFirst({
            where: {
                OR: orConditions,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('A package with this name already exists.');
        }
        const features = createPackageDto.features;
        return this.prisma.package.create({
            data: {
                ...createPackageDto,
                features,
            },
        });
    }
    async findAll(search, billingType, role) {
        const where = {};
        if (search) {
            where.OR = [
                { nameEn: { contains: search, mode: 'insensitive' } },
                { nameAr: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (billingType) {
            where.billingType = billingType;
        }
        let audienceRole;
        if (role && role !== 'SUPER_ADMIN') {
            if (role === 'SERVICE_PROVIDER') {
                audienceRole = client_1.PackageTarget.INDIVIDUAL;
            }
            else if (Object.values(client_1.PackageTarget).includes(role)) {
                audienceRole = role;
            }
        }
        if (audienceRole) {
            where.isActive = true;
            where.OR = [
                { targetAudience: client_1.PackageTarget.ALL },
                { targetAudience: audienceRole },
            ];
        }
        else if (!role) {
            where.isActive = true;
            where.targetAudience = client_1.PackageTarget.ALL;
        }
        return this.prisma.package.findMany({
            where,
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findOne(id) {
        const pkg = await this.prisma.package.findUnique({ where: { id } });
        if (!pkg)
            throw new common_1.NotFoundException('Package not found');
        return pkg;
    }
    async update(id, updatePackageDto) {
        const pkg = await this.findOne(id);
        if (updatePackageDto.nameEn || updatePackageDto.nameAr || updatePackageDto.nameUr) {
            const orConditions = [];
            if (updatePackageDto.nameEn)
                orConditions.push({ nameEn: { equals: updatePackageDto.nameEn, mode: 'insensitive' } });
            if (updatePackageDto.nameAr)
                orConditions.push({ nameAr: { equals: updatePackageDto.nameAr, mode: 'insensitive' } });
            if (updatePackageDto.nameUr)
                orConditions.push({ nameUr: { equals: updatePackageDto.nameUr, mode: 'insensitive' } });
            const existing = await this.prisma.package.findFirst({
                where: {
                    id: { not: id },
                    OR: orConditions,
                },
            });
            if (existing) {
                throw new common_1.BadRequestException('A package with this name already exists.');
            }
        }
        const features = updatePackageDto.features
            ? updatePackageDto.features
            : undefined;
        return this.prisma.package.update({
            where: { id },
            data: {
                ...updatePackageDto,
                features,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.package.delete({ where: { id } });
    }
};
exports.PackagesService = PackagesService;
exports.PackagesService = PackagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PackagesService);
//# sourceMappingURL=packages.service.js.map