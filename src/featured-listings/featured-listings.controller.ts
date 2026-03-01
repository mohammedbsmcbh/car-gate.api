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
import { FeaturedListingsService } from './featured-listings.service';
import { CreateFeaturedListingDto, UpdateFeaturedListingDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';

@Controller('featured-listings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeaturedListingsController {
  constructor(private featuredListingsService: FeaturedListingsService) {}

  // Public - Get all featured listings
  @Public()
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.featuredListingsService.findAll(page, limit);
  }

  // Public - Get single featured listing
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.featuredListingsService.findOne(id);
  }

  // Create featured listing
  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  async create(
    @Body() dto: CreateFeaturedListingDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.featuredListingsService.create(dto, userId, userRole);
  }

  // Update featured listing
  @Patch(':listingId')
  @Roles(UserRole.SUPER_ADMIN)
  async update(
    @Param('listingId') listingId: string,
    @Body() dto: UpdateFeaturedListingDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.featuredListingsService.update(listingId, dto, userId, userRole);
  }

  // Remove featured status
  @Delete(':listingId')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(
    @Param('listingId') listingId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.featuredListingsService.remove(listingId, userId, userRole);
  }

  // Admin - Cleanup expired
  @Post('cleanup')
  @Roles(UserRole.SUPER_ADMIN)
  async cleanupExpired() {
    return this.featuredListingsService.cleanupExpired();
  }
}
