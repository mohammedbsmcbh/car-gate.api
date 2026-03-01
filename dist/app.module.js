"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const config_1 = require("@nestjs/config");
const config_module_1 = require("./config/config.module");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const health_module_1 = require("./health/health.module");
const mail_module_1 = require("./mail/mail.module");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
const users_module_1 = require("./users/users.module");
const listings_module_1 = require("./listings/listings.module");
const agencies_module_1 = require("./agencies/agencies.module");
const inquiries_module_1 = require("./inquiries/inquiries.module");
const complaints_module_1 = require("./complaints/complaints.module");
const roles_module_1 = require("./roles/roles.module");
const showrooms_module_1 = require("./showrooms/showrooms.module");
const featured_listings_module_1 = require("./featured-listings/featured-listings.module");
const media_module_1 = require("./media/media.module");
const search_module_1 = require("./search/search.module");
const settings_module_1 = require("./settings/settings.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const payments_module_1 = require("./payments/payments.module");
const chat_module_1 = require("./chat/chat.module");
const notifications_module_1 = require("./notifications/notifications.module");
const offers_module_1 = require("./offers/offers.module");
const inspection_centers_module_1 = require("./inspection-centers/inspection-centers.module");
const polishing_centers_module_1 = require("./polishing-centers/polishing-centers.module");
const customs_clearers_module_1 = require("./customs-clearers/customs-clearers.module");
const service_providers_module_1 = require("./service-providers/service-providers.module");
const analytics_module_1 = require("./analytics/analytics.module");
const packages_module_1 = require("./packages/packages.module");
const stories_module_1 = require("./stories/stories.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const banners_module_1 = require("./banners/banners.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(logger_middleware_1.LoggerMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_module_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => [{
                        ttl: config.get('RATE_LIMIT_TTL', 60000),
                        limit: config.get('RATE_LIMIT_LIMIT', 100),
                    }],
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            health_module_1.HealthModule,
            mail_module_1.MailModule,
            users_module_1.UsersModule,
            listings_module_1.ListingsModule,
            agencies_module_1.AgenciesModule,
            inquiries_module_1.InquiriesModule,
            complaints_module_1.ComplaintsModule,
            roles_module_1.RolesModule,
            showrooms_module_1.ShowroomsModule,
            featured_listings_module_1.FeaturedListingsModule,
            media_module_1.MediaModule,
            search_module_1.SearchModule,
            settings_module_1.SettingsModule,
            audit_logs_module_1.AuditLogsModule,
            payments_module_1.PaymentsModule,
            chat_module_1.ChatModule,
            notifications_module_1.NotificationsModule,
            offers_module_1.OffersModule,
            inspection_centers_module_1.InspectionCentersModule,
            polishing_centers_module_1.PolishingCentersModule,
            customs_clearers_module_1.CustomsClearersModule,
            service_providers_module_1.ServiceProvidersModule,
            analytics_module_1.AnalyticsModule,
            packages_module_1.PackagesModule,
            stories_module_1.StoriesModule,
            subscriptions_module_1.SubscriptionsModule,
            banners_module_1.BannersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map