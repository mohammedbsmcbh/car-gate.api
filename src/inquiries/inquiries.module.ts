import { Module } from '@nestjs/common';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [NotificationsModule, PrismaModule],
    controllers: [InquiriesController],
    providers: [InquiriesService],
    exports: [InquiriesService],
})
export class InquiriesModule { }
