import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Query,
    UseGuards,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto, UpdateComplaintDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, ComplaintStatus } from '@prisma/client';

@Controller('complaints')
@UseGuards(JwtAuthGuard)
export class ComplaintsController {
    constructor(private complaintsService: ComplaintsService) { }

    // Create complaint
    @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute
    @Post()
    async create(
        @Body() dto: CreateComplaintDto,
        @CurrentUser('id') userId: string,
    ) {
        return this.complaintsService.create(dto, userId);
    }

    // Get my complaints
    @Get('my')
    async getMyComplaints(
        @CurrentUser('id') userId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ) {
        return this.complaintsService.getMyComplaints(userId, page, limit);
    }

    // Admin - list all complaints
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Get()
    async findAll(
        @Query('status') status: ComplaintStatus,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ) {
        return this.complaintsService.findAll(status, page, limit);
    }

    // Admin - get single complaint
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.complaintsService.findOne(id);
    }

    // Admin - update complaint status
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateComplaintDto,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
    ) {
        return this.complaintsService.update(id, dto, userId, userRole);
    }
}
