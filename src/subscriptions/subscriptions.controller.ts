import { Controller, Get, Post, Body, UseGuards, Request, Patch, Param, Query, Delete } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('my-subscription')
  async getMySubscription(@Request() req) {
    return this.subscriptionsService.getCurrentSubscription(req.user.id);
  }

  // Admin: Get all subscriptions (useful for approval list)
  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async getAllSubscriptions(@Query('status') status?: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED') {
    return this.subscriptionsService.findAll(status);
  }

  @Get('usage')
  async getMyUsage(@Request() req) {
    return this.subscriptionsService.getUsageStats(req.user.id);
  }

  @Post('subscribe')
  async subscribe(@Request() req, @Body('packageId') packageId: string) {
    return this.subscriptionsService.subscribe(req.user.id, packageId);
  }

  @Patch(':id/activate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async activateSubscription(@Param('id') id: string) {
    return this.subscriptionsService.activateSubscription(id);
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async cancelSubscription(@Param('id') id: string) {
    return this.subscriptionsService.cancelSubscription(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async updateSubscription(@Param('id') id: string, @Body() body: any) {
    return this.subscriptionsService.updateSubscription(id, body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async deleteSubscription(@Param('id') id: string) {
    return this.subscriptionsService.deleteSubscription(id);
  }
}
