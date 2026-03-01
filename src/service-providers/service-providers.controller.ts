import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';
import {
  CreateServiceProviderDto,
  UpdateServiceProviderDto,
  CreateServiceItemDto,
  UpdateServiceItemDto,
  CreateBookingDto,
  CreateServiceRequestDto,
} from './dto/service-provider.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ServiceProviderType, UserRole } from '@prisma/client';

@Controller('service-providers')
export class ServiceProvidersController {
  constructor(private readonly service: ServiceProvidersService) {}

  // ─── Public ─────────────────────────────────────────────────────────────────

  @Public()
  @Get()
  findAll(
    @Query('type') type: ServiceProviderType,
    @Query('city') city?: string,
  ) {
    return this.service.findAll(type, city);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // Public: create booking (any visitor can book, login optional)
  @Public()
  @Post(':id/book')
  createBooking(
    @Param('id') providerId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.service.createBooking(providerId, dto, undefined);
  }

  // Public: create service request for customs clearer
  @Public()
  @Post(':id/request')
  createServiceRequest(
    @Param('id') providerId: string,
    @Body() dto: CreateServiceRequestDto,
  ) {
    return this.service.createServiceRequest(providerId, dto, undefined);
  }

  // ─── Auth (SERVICE_PROVIDER) ─────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('my/profile')
  getMyProfile(@CurrentUser('id') userId: string) {
    return this.service.findMyProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('my/profile')
  upsertProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateServiceProviderDto,
  ) {
    return this.service.upsertProfile(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my/profile')
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateServiceProviderDto,
  ) {
    return this.service.updateProfile(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('my/services')
  addService(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateServiceItemDto,
  ) {
    return this.service.addService(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my/services/:itemId')
  updateService(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateServiceItemDto,
  ) {
    return this.service.updateService(userId, itemId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('my/services/:itemId')
  deleteService(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.service.deleteService(userId, itemId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/bookings')
  getMyBookings(@CurrentUser('id') userId: string) {
    return this.service.getMyBookings(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my/bookings/:bookingId/status')
  updateBookingStatus(
    @CurrentUser('id') userId: string,
    @Param('bookingId') bookingId: string,
    @Body() body: { status: string },
  ) {
    return this.service.updateBookingStatus(userId, bookingId, body.status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/requests')
  getMyRequests(@CurrentUser('id') userId: string) {
    return this.service.getMyRequests(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my/requests/:requestId/status')
  updateRequestStatus(
    @CurrentUser('id') userId: string,
    @Param('requestId') requestId: string,
    @Body() body: { status: string },
  ) {
    return this.service.updateRequestStatus(userId, requestId, body.status);
  }

  // ─── Super Admin ─────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('admin/all')
  findAllAdmin(
    @Query('type') type?: ServiceProviderType,
    @Query('approved') approved?: string,
  ) {
    return this.service.findAllAdmin(type, approved);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('admin/pending-services')
  getPendingServices() {
    return this.service.getPendingServices();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch('admin/services/:itemId/approve')
  approveServiceItem(
    @Param('itemId') itemId: string,
    @Body() body: { approved: boolean },
  ) {
    return this.service.approveServiceItem(itemId, body.approved);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch('admin/:id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approved: boolean },
  ) {
    return this.service.approve(id, body.approved);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


