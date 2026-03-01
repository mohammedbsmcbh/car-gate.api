"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let SubscriptionsService = class SubscriptionsService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async getCurrentSubscription(userId) {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                userId,
                status: 'ACTIVE',
                endDate: { gt: new Date() },
            },
            include: {
                package: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!subscription) {
            return null;
        }
        return subscription;
    }
    async getUsageStats(userId) {
        const sub = await this.getCurrentSubscription(userId);
        if (!sub)
            return { hasActiveSubscription: false };
        const limits = sub.limits;
        return {
            hasActiveSubscription: true,
            subscription: {
                nameEn: sub.package.nameEn,
                nameAr: sub.package.nameAr,
                startDate: sub.startDate,
                endDate: sub.endDate,
                daysRemaining: Math.ceil((new Date(sub.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            },
            usage: {
                listings: {
                    used: sub.listingsUsed,
                    limit: limits.maxListings || 0,
                    remaining: Math.max(0, (limits.maxListings || 0) - sub.listingsUsed)
                },
                stories: {
                    used: sub.storiesUsed,
                    limit: limits.maxStories || 0,
                    remaining: Math.max(0, (limits.maxStories || 0) - sub.storiesUsed)
                },
                features: {
                    priorityListing: limits.priorityListing || false,
                    enableFeatured: limits.enableFeatured || false,
                }
            }
        };
    }
    async subscribe(userId, packageId) {
        const pkg = await this.prisma.package.findUnique({
            where: { id: packageId },
        });
        if (!pkg) {
            throw new common_1.NotFoundException('Package not found');
        }
        await this.prisma.subscription.updateMany({
            where: {
                userId,
                status: 'ACTIVE',
            },
            data: {
                status: 'CANCELLED',
            },
        });
        const features = pkg.features;
        const durationDays = features.durationDays || 30;
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + durationDays);
        return this.prisma.subscription.create({
            data: {
                userId,
                packageId,
                endDate,
                status: 'PENDING',
                limits: pkg.features,
            },
        }).then(async (sub) => {
            const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
            if (user?.email) {
                this.mailService.sendSubscriptionPendingEmail(user.email, user.name || '', pkg.nameAr || pkg.nameEn).catch(() => null);
            }
            return sub;
        });
    }
    async activateSubscription(subscriptionId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
            include: { package: true, user: { select: { email: true, name: true } } },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const limits = subscription.limits;
        const durationDays = limits.durationDays || 30;
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + durationDays);
        const updated = await this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: endDate,
            },
        });
        if (subscription.user?.email) {
            this.mailService.sendSubscriptionActivatedEmail(subscription.user.email, subscription.user.name || '', subscription.package.nameAr || subscription.package.nameEn, endDate).catch(() => null);
        }
        return updated;
    }
    async findAll(status) {
        const subscriptions = await this.prisma.subscription.findMany({
            where: status ? { status } : undefined,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        role: true,
                        avatar: true,
                    },
                },
                package: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const enrichedSubscriptions = await Promise.all(subscriptions.map(async (sub) => {
            const listingsCount = await this.prisma.listing.count({
                where: {
                    ownerId: sub.userId,
                    createdAt: {
                        gte: sub.startDate,
                        lte: sub.endDate,
                    },
                    status: { not: 'REJECTED' }
                },
            });
            const storiesCount = await this.prisma.story.count({
                where: {
                    userId: sub.userId,
                    status: 'APPROVED',
                    createdAt: {
                        gte: sub.startDate,
                        lte: sub.endDate,
                    },
                },
            });
            return {
                ...sub,
                listingsUsed: listingsCount,
                storiesUsed: storiesCount,
            };
        }));
        return enrichedSubscriptions;
    }
    async cancelSubscription(id) {
        return this.prisma.subscription.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
    async deleteSubscription(id) {
        return this.prisma.subscription.delete({
            where: { id },
        });
    }
    async updateSubscription(id, data) {
        return this.prisma.subscription.update({
            where: { id },
            data: {
                ...data,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
        });
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map