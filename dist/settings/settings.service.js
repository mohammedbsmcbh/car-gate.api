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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let SettingsService = class SettingsService {
    prisma;
    auditLogs;
    constructor(prisma, auditLogs) {
        this.prisma = prisma;
        this.auditLogs = auditLogs;
    }
    async listSettings() {
        return this.prisma.systemSetting.findMany({ orderBy: { key: 'asc' } });
    }
    async getSetting(key) {
        return this.prisma.systemSetting.findUnique({ where: { key } });
    }
    async upsertSetting(key, dto, actorId) {
        const updated = await this.prisma.systemSetting.upsert({
            where: { key },
            create: {
                key,
                value: dto.value,
                description: dto.description,
            },
            update: {
                value: dto.value,
                description: dto.description,
            },
        });
        await this.auditLogs.log({
            actorId: actorId ?? null,
            action: 'SETTING_UPSERTED',
            entityType: 'SystemSetting',
            entityId: updated.id,
            metadata: { key, description: dto.description ?? null },
        });
        return updated;
    }
    async listFeaturedPricing(publicOnly = true) {
        return this.prisma.featuredPricing.findMany({
            where: publicOnly ? { isActive: true } : undefined,
            orderBy: [{ isActive: 'desc' }, { days: 'asc' }],
        });
    }
    async createFeaturedPricing(dto, actorId) {
        const created = await this.prisma.featuredPricing.create({
            data: {
                name: dto.name,
                days: dto.days,
                price: dto.price,
                currency: dto.currency ?? 'BHD',
                isActive: dto.isActive ?? true,
            },
        });
        await this.auditLogs.log({
            actorId: actorId ?? null,
            action: 'FEATURED_PRICING_CREATED',
            entityType: 'FeaturedPricing',
            entityId: created.id,
            metadata: { days: dto.days, price: dto.price, currency: created.currency },
        });
        return created;
    }
    async updateFeaturedPricing(id, dto, actorId) {
        const updated = await this.prisma.featuredPricing.update({
            where: { id },
            data: {
                ...dto,
                currency: dto.currency,
            },
        });
        await this.auditLogs.log({
            actorId: actorId ?? null,
            action: 'FEATURED_PRICING_UPDATED',
            entityType: 'FeaturedPricing',
            entityId: id,
            metadata: dto,
        });
        return updated;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_logs_service_1.AuditLogsService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map