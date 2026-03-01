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
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { CreateAgencyDto, UpdateAgencyDto, CreateSubAdminDto, AgencyFilterDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('agencies')
export class AgenciesController {
    constructor(private agenciesService: AgenciesService) { }

    // Public - list agencies
    @Public()
    @Get()
    async findAll(
        @Query() filters: AgencyFilterDto,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ) {
        // Legacy data fix: ensure approved agency accounts have an Agency profile row.
        await this.agenciesService.backfillMissingAgencies();

        // Only show approved agencies to public
        filters.isApproved = true;
        return this.agenciesService.findAll(filters, page, limit);
    }

    // Auth - my agency
    @UseGuards(JwtAuthGuard)
    @Get('my')
    async getMyAgency(@CurrentUser('id') userId: string) {
        // Ensure legacy/dev accounts have profile rows
        await this.agenciesService.backfillMissingAgencies();
        return this.agenciesService.findByUserId(userId);
    }

    // Admin - list all agencies
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Get('admin/all')
    async findAllAdmin(
        @Query() filters: AgencyFilterDto,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ) {
        // Legacy data fix: ensure agency accounts have an Agency profile row.
        await this.agenciesService.backfillMissingAgencies();
        return this.agenciesService.findAll(filters, page, limit);
    }

    // Admin - delete agency
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.agenciesService.remove(id);
    }

    // Public - single agency
    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.agenciesService.findOne(id);
    }

    // Auth - create agency
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.AGENCY)
    @Post()
    async create(
        @Body() dto: CreateAgencyDto,
        @CurrentUser('id') userId: string,
    ) {
        return this.agenciesService.create(dto, userId);
    }

    // Auth - update agency
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateAgencyDto,
        @CurrentUser('id') userId: string,
    ) {
        return this.agenciesService.update(id, dto, userId);
    }

    // Admin - approve agency
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Patch(':id/approve')
    async approve(
        @Param('id') id: string,
        @Body() body: { approved: boolean },
    ) {
        return this.agenciesService.approve(id, body.approved);
    }

    // Auth - sub-admin management
    @UseGuards(JwtAuthGuard)
    @Get(':id/sub-admins')
    async getSubAdmins(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.agenciesService.getSubAdmins(id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/sub-admins')
    async addSubAdmin(
        @Param('id') id: string,
        @Body() dto: CreateSubAdminDto,
        @CurrentUser('id') userId: string,
    ) {
        return this.agenciesService.addSubAdmin(id, dto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/sub-admins/:subAdminId')
    async removeSubAdmin(
        @Param('id') id: string,
        @Param('subAdminId') subAdminId: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.agenciesService.removeSubAdmin(id, subAdminId, userId);
    }
}
// Force update
