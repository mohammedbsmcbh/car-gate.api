import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

// Core modules
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { HealthModule } from './health/health.module';
import { MailModule } from './mail/mail.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

// Feature modules
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { AgenciesModule } from './agencies/agencies.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { RolesModule } from './roles/roles.module';
import { ShowroomsModule } from './showrooms/showrooms.module';
import { FeaturedListingsModule } from './featured-listings/featured-listings.module';
import { MediaModule } from './media/media.module';
import { SearchModule } from './search/search.module';
import { SettingsModule } from './settings/settings.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { PaymentsModule } from './payments/payments.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OffersModule } from './offers/offers.module';
import { InspectionCentersModule } from './inspection-centers/inspection-centers.module';
import { PolishingCentersModule } from './polishing-centers/polishing-centers.module';
import { CustomsClearersModule } from './customs-clearers/customs-clearers.module';
import { ServiceProvidersModule } from './service-providers/service-providers.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PackagesModule } from './packages/packages.module';
import { StoriesModule } from './stories/stories.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BannersModule } from './banners/banners.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule,

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [{
        ttl: config.get('RATE_LIMIT_TTL', 60000),
        limit: config.get('RATE_LIMIT_LIMIT', 100),
      }],
    }),

    // Core modules
    PrismaModule,
    AuthModule,
    HealthModule,
    MailModule,

// Feature modules
    UsersModule,
    ListingsModule,
    AgenciesModule,
    InquiriesModule,
    ComplaintsModule,
    RolesModule,
    ShowroomsModule,
    FeaturedListingsModule,
    MediaModule,
    SearchModule,
    SettingsModule,
    AuditLogsModule,
    PaymentsModule,
    ChatModule,
    NotificationsModule,
    OffersModule,
    InspectionCentersModule,
    PolishingCentersModule,
    CustomsClearersModule,
    ServiceProvidersModule,
    AnalyticsModule,
    PackagesModule,
    StoriesModule,
    SubscriptionsModule,
    BannersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global JWT guard - all routes protected by default
    // Use @Public() decorator to make routes public
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
