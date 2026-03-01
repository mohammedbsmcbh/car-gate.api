import { Controller, Get, Post, Body, Query, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole, ApprovalStatus } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Stories')
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createStoryDto: CreateStoryDto) {
    return this.storiesService.create(req.user.id, createStoryDto);
  }

  // Admin: Get pending
  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  findAllPending() {
    return this.storiesService.findAllPending();
  }

  // Admin: Approve/Reject
  @Patch('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  updateStatus(
      @Param('id') id: string,
      @Body('status') status: ApprovalStatus
  ) {
      return this.storiesService.updateStatus(id, status);
  }

  @Get()
  @Public()
  findAll(@Query('role') role?: string) {
    const validRoles = ['AGENCY', 'SHOWROOM', 'INDIVIDUAL', 'CUSTOMS_CLEARER', 'INSPECTION_CENTER', 'POLISHING_CENTER'] as const;
    type ValidRole = typeof validRoles[number];
    const targetRole = validRoles.includes(role as ValidRole) ? (role as ValidRole) : undefined;
    return this.storiesService.findAllActive(targetRole);
  }

  @Get('my-stories')
  @UseGuards(JwtAuthGuard)
  findMyStories(@Request() req) {
      return this.storiesService.findMyStories(req.user.id);
  }
}
