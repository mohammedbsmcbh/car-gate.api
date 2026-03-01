import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { CreateFeaturedPricingDto, UpdateFeaturedPricingDto } from './dto/featured-pricing.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    private auditLogs: AuditLogsService,
  ) {}

  async listSettings() {
    return this.prisma.systemSetting.findMany({ orderBy: { key: 'asc' } });
  }

  async getSetting(key: string) {
    return this.prisma.systemSetting.findUnique({ where: { key } });
  }

  async upsertSetting(key: string, dto: UpsertSettingDto, actorId?: string) {
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

  async createFeaturedPricing(dto: CreateFeaturedPricingDto, actorId?: string) {
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

  async updateFeaturedPricing(id: string, dto: UpdateFeaturedPricingDto, actorId?: string) {
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
      metadata: dto as any,
    });

    return updated;
  }
}
