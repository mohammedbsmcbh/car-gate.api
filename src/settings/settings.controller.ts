import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { CreateFeaturedPricingDto, UpdateFeaturedPricingDto } from './dto/featured-pricing.dto';

@Controller()
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  // Public pricing options for clients (e.g., feature listing plans)
  @Public()
  @Get('featured-pricing')
  async listFeaturedPricing() {
    return this.settingsService.listFeaturedPricing(true);
  }

  // Admin-only: manage featured pricing
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('admin/featured-pricing')
  async listFeaturedPricingAdmin() {
    return this.settingsService.listFeaturedPricing(false);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('admin/featured-pricing')
  async createFeaturedPricing(
    @Body() dto: CreateFeaturedPricingDto,
    @CurrentUser('id') adminId: string,
  ) {
    return this.settingsService.createFeaturedPricing(dto, adminId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch('admin/featured-pricing/:id')
  async updateFeaturedPricing(
    @Param('id') id: string,
    @Body() dto: UpdateFeaturedPricingDto,
    @CurrentUser('id') adminId: string,
  ) {
    return this.settingsService.updateFeaturedPricing(id, dto, adminId);
  }

  // Admin-only: system settings key/value store
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('admin/settings')
  async listSettings() {
    return this.settingsService.listSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('admin/settings/:key')
  async getSetting(@Param('key') key: string) {
    return this.settingsService.getSetting(key);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch('admin/settings/:key')
  async upsertSetting(
    @Param('key') key: string,
    @Body() dto: UpsertSettingDto,
    @CurrentUser('id') adminId: string,
  ) {
    return this.settingsService.upsertSetting(key, dto, adminId);
  }

  // Optional helper to read a setting publicly (opt-in via ?key=)
  @Public()
  @Get('settings')
  async getPublicSetting(@Query('key') key?: string) {
    if (!key) return { message: 'Missing key' };
    const setting = await this.settingsService.getSetting(key);
    return setting ?? { key, value: null };
  }
}
