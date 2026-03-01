import {
    Controller,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, AdminUpdateUserDto, UserFilterDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    // Get current user profile
    @Get('me')
    async getMe(@CurrentUser('id') userId: string) {
        return this.usersService.findOne(userId);
    }

    // Update current user profile
    @Patch('me')
    async updateMe(
        @Body() dto: UpdateUserDto,
        @CurrentUser('id') userId: string,
    ) {
        return this.usersService.update(userId, dto, userId);
    }

    @Patch('push-token')
    async registerPushToken(
        @Body() body: { pushToken: string; preferredLanguage?: 'EN' | 'AR' | 'UR' },
        @CurrentUser('id') userId: string,
    ) {
        return this.usersService.update(userId, {
            pushToken: body.pushToken,
            preferredLanguage: body.preferredLanguage || 'EN',
        }, userId);
    }

    // Admin only - list all users
    @Get()
    @Roles(UserRole.SUPER_ADMIN)
    async findAll(
        @Query() filters: UserFilterDto,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ) {
        return this.usersService.findAll(filters, page, limit);
    }

    // Admin only - pending approvals
    @Get('pending-approvals')
    @Roles(UserRole.SUPER_ADMIN)
    async getPendingApprovals(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ) {
        return this.usersService.getPendingApprovals(page, limit);
    }

    // Get single user
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    // Update own profile
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
        @CurrentUser('id') currentUserId: string,
    ) {
        return this.usersService.update(id, dto, currentUserId);
    }

    // Admin only - update any user
    @Patch(':id/admin')
    @Roles(UserRole.SUPER_ADMIN)
    async adminUpdate(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
        return this.usersService.adminUpdate(id, dto);
    }

    // Admin only - approve/reject user
    @Patch(':id/approve')
    @Roles(UserRole.SUPER_ADMIN)
    async approve(
        @Param('id') id: string,
        @Body() body: { approved: boolean; notes?: string },
        @CurrentUser('id') adminId: string,
    ) {
        return this.usersService.approve(id, adminId, body.approved, body.notes);
    }

    // Admin only - delete user
    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN)
    async delete(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
