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
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ShowroomsService } from './showrooms.service';
import {
  CreateShowroomDto,
  UpdateShowroomDto,
  CreateSubAdminDto,
  ShowroomFilterDto,
} from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';

@Controller('showrooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShowroomsController {
  constructor(private showroomsService: ShowroomsService) {}

  // Public - Get all approved showrooms
  @Public()
  @Get()
  async findAll(
    @Query() filters: ShowroomFilterDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.showroomsService.findAll(filters, page, limit);
  }

  // Get my showroom
  @Get('my')
  @Roles(UserRole.SHOWROOM)
  async getMyShowroom(@CurrentUser('id') userId: string) {
    return this.showroomsService.findByUserId(userId);
  }

  // Public - Get showroom details
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.showroomsService.findOne(id);
  }

  // Create showroom
  @Post()
  @Roles(UserRole.SHOWROOM)
  async create(
    @Body() dto: CreateShowroomDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.showroomsService.create(dto, userId);
  }

  // Update showroom
  @Patch(':id')
  @Roles(UserRole.SHOWROOM)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateShowroomDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.showroomsService.update(id, dto, userId);
  }

  // Admin - Approve showroom
  @Patch(':id/approve')
  @Roles(UserRole.SUPER_ADMIN)
  async approve(
    @Param('id') id: string,
    @Body('approved') approved: boolean,
    @CurrentUser('id') adminId: string,
  ) {
    return this.showroomsService.approve(id, approved, adminId);
  }

  // Get sub-admins
  @Get(':id/sub-admins')
  @Roles(UserRole.SHOWROOM)
  async getSubAdmins(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.showroomsService.getSubAdmins(id, userId);
  }

  // Add sub-admin
  @Post(':id/sub-admins')
  @Roles(UserRole.SHOWROOM)
  async addSubAdmin(
    @Param('id') id: string,
    @Body() dto: CreateSubAdminDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.showroomsService.addSubAdmin(id, dto, userId);
  }

  // Remove sub-admin
  @Delete(':id/sub-admins/:subAdminId')
  @Roles(UserRole.SHOWROOM)
  async removeSubAdmin(
    @Param('id') id: string,
    @Param('subAdminId') subAdminId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.showroomsService.removeSubAdmin(id, subAdminId, userId);
  }

  // Admin - Delete showroom
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return this.showroomsService.remove(id);
  }
}
