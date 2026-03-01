import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [PrismaModule, NotificationsModule, MailModule],
    controllers: [ListingsController],
    providers: [ListingsService],
    exports: [ListingsService],
})
export class ListingsModule { }
