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
exports.BannersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let BannersService = class BannersService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    inferMediaTypeFromUrl(mediaUrl) {
        const url = (mediaUrl || '').split('?')[0].toLowerCase();
        if (url.endsWith('.mp4') ||
            url.endsWith('.mov') ||
            url.endsWith('.m4v') ||
            url.endsWith('.webm') ||
            url.endsWith('.m3u8')) {
            return 'VIDEO';
        }
        return 'IMAGE';
    }
    async create(dto) {
        const mediaType = dto.mediaType ?? this.inferMediaTypeFromUrl(dto.mediaUrl);
        const banner = await this.prisma.banner.create({
            data: {
                ...dto,
                mediaType,
            },
        });
        if (banner.isActive) {
            await this.notificationsService.broadcast('NEW_BANNER', { bannerTitle: banner.title, bannerId: banner.id }, {
                language: banner.language === client_1.Language.ALL ? undefined : banner.language
            });
        }
        return banner;
    }
    findAll(activeOnly = false, language) {
        const where = {};
        if (activeOnly) {
            where.isActive = true;
        }
        if (language) {
            where.language = {
                in: ['ALL', language.toUpperCase()]
            };
        }
        return this.prisma.banner.findMany({
            where,
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findOne(id) {
        const banner = await this.prisma.banner.findUnique({ where: { id } });
        if (!banner)
            throw new common_1.NotFoundException('Banner not found');
        return banner;
    }
    async update(id, dto) {
        await this.findOne(id);
        const mediaType = dto.mediaType ?? (dto.mediaUrl ? this.inferMediaTypeFromUrl(dto.mediaUrl) : undefined);
        return this.prisma.banner.update({
            where: { id },
            data: {
                ...dto,
                ...(mediaType ? { mediaType } : {}),
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.banner.delete({ where: { id } });
    }
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], BannersService);
//# sourceMappingURL=banners.service.js.map