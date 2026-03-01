import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, Ip } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { UpdateListingStatusDto } from './dto/update-listing-status.dto';
import { ListingFilterDto } from './dto/listing.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('listings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) { }

    @Post()
    @Roles(UserRole.AGENCY, UserRole.SHOWROOM, UserRole.TRADER, UserRole.INDIVIDUAL, UserRole.SERVICE_PROVIDER)
    create(@Req() req, @Body() createListingDto: CreateListingDto) {
        return this.listingsService.create(req.user.id, createListingDto);
    }

    @Public()
    @Get()
    findAll(@Query() filterDto: ListingFilterDto) {
        return this.listingsService.findAllPublic(filterDto);
    }

    @Get('my')
    @Roles(UserRole.AGENCY, UserRole.SHOWROOM, UserRole.TRADER, UserRole.INDIVIDUAL, UserRole.SERVICE_PROVIDER)
    findMyListings(@Req() req, @Query() paginationDto: PaginationDto) {
        return this.listingsService.findMyListings(req.user.id, paginationDto.page, paginationDto.limit);
    }

    @Get('liked')
    findLiked(@Req() req, @Query() paginationDto: PaginationDto) {
        return this.listingsService.findLiked(req.user.id, paginationDto.page, paginationDto.limit);
    }

    @Get('admin')
    @Roles(UserRole.SUPER_ADMIN)
    findAllAdmin(@Query() paginationDto: PaginationDto) {
        return this.listingsService.findAllAdmin(paginationDto.page, paginationDto.limit);
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string, @Req() req) {
        return this.listingsService.findOne(id, req.user?.id);
    }

    @Public()
    @Post(':id/view')
    incrementViewCount(@Param('id') id: string, @Ip() ip: string, @Req() req) {
        return this.listingsService.incrementViewCount(id, ip, req.user?.id);
    }

    @Post(':id/like')
    toggleLike(@Req() req, @Param('id') id: string) {
        return this.listingsService.toggleLike(req.user.id, id);
    }

    @Post(':id/offers')
    createOffer(@Req() req, @Param('id') id: string, @Body() createOfferDto: CreateOfferDto) {
        return this.listingsService.createOffer(req.user.id, id, createOfferDto.amount, createOfferDto.message);
    }

    @Patch(':id/status')
    @Roles(UserRole.SUPER_ADMIN)
    updateStatus(@Param('id') id: string, @Body() updateListingStatusDto: UpdateListingStatusDto) {
        return this.listingsService.updateStatus(id, updateListingStatusDto);
    }

    @Patch(':id')
    @Roles(UserRole.AGENCY, UserRole.SHOWROOM, UserRole.TRADER, UserRole.INDIVIDUAL, UserRole.SERVICE_PROVIDER)
    update(@Req() req, @Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
        return this.listingsService.update(req.user.id, id, updateListingDto);
    }

    @Delete(':id')
    remove(@Req() req, @Param('id') id: string) {
        return this.listingsService.remove(req.user.id, req.user.role, id);
    }
}
