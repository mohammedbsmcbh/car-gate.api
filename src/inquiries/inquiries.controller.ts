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
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('inquiries')
@UseGuards(JwtAuthGuard)
export class InquiriesController {
    constructor(private inquiriesService: InquiriesService) { }

    // Get my received inquiries (Explicit path)
    @Get('my')
    async getMyInquiriesExplicit(
        @CurrentUser('id') userId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ) {
        return this.inquiriesService.getMyInquiries(userId, page, limit);
    }

    // Create inquiry
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
    @Post()
    async create(
        @Body() dto: CreateInquiryDto,
        @CurrentUser('id') userId: string,
    ) {
        return this.inquiriesService.create(dto, userId);
    }

    // Get my received inquiries
    @Get()
    async getMyInquiries(
        @CurrentUser('id') userId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ) {
        return this.inquiriesService.getMyInquiries(userId, page, limit);
    }

    @Get(':id/messages')
    async getMessages(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.inquiriesService.getMessages(id, userId);
    }

    @Get(':id')
    async getInquiry(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.inquiriesService.getInquiry(id, userId);
    }

    // Get unread count
    @Get('unread-count')
    async getUnreadCount(@CurrentUser('id') userId: string) {
        return this.inquiriesService.getUnreadCount(userId);
    }

    // Mark as read
    @Patch(':id/read')
    async markAsRead(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.inquiriesService.markAsRead(id, userId);
    }
}
