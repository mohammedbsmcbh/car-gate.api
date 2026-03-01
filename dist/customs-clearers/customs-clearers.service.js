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
exports.CustomsClearersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_config_1 = require("../media/cloudinary.config");
let CustomsClearersService = class CustomsClearersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
        (0, cloudinary_config_1.configureCloudinary)();
    }
    async create(createdById, dto) {
        let imageUrl;
        if (dto.image) {
            try {
                const result = await cloudinary_config_1.cloudinary.uploader.upload(dto.image, {
                    folder: `car-gate/customs-clearers/${createdById}`,
                    resource_type: 'image',
                    transformation: [
                        { width: 800, height: 800, crop: 'limit' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' },
                    ],
                });
                imageUrl = result.secure_url;
            }
            catch (e) {
                throw new common_1.BadRequestException('Failed to upload image');
            }
        }
        const { image, ...data } = dto;
        return this.prisma.customsClearer.create({
            data: {
                ...data,
                imageUrl,
                createdById,
            },
        });
    }
    findAllPublic() {
        return this.prisma.customsClearer.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.CustomsClearersService = CustomsClearersService;
exports.CustomsClearersService = CustomsClearersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomsClearersService);
//# sourceMappingURL=customs-clearers.service.js.map