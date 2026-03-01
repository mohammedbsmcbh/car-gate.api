import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async getCurrentSubscription(userId: string) {
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
  
  async getUsageStats(userId: string) {
      const sub = await this.getCurrentSubscription(userId);
      if (!sub) return { hasActiveSubscription: false };
      
      const limits = sub.limits as any;
      
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

  async subscribe(userId: string, packageId: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    // Cancel currently active subscriptions
    await this.prisma.subscription.updateMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      data: {
        status: 'CANCELLED',
      },
    });

    const features = pkg.features as any;
    const durationDays = features.durationDays || 30;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    return this.prisma.subscription.create({
      data: {
        userId,
        packageId,
        endDate,
        status: 'PENDING',
        limits: pkg.features as any,
      },
    }).then(async (sub) => {
      // Send pending email (fire-and-forget)
      const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
      if (user?.email) {
        this.mailService.sendSubscriptionPendingEmail(user.email, user.name || '', pkg.nameAr || pkg.nameEn).catch(() => null);
      }
      return sub;
    });
  }

  async activateSubscription(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { package: true, user: { select: { email: true, name: true } } },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Calculate end date from approval time
    const limits = subscription.limits as any;
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

    // Send activation email (fire-and-forget)
    if (subscription.user?.email) {
      this.mailService.sendSubscriptionActivatedEmail(
        subscription.user.email,
        subscription.user.name || '',
        subscription.package.nameAr || subscription.package.nameEn,
        endDate,
      ).catch(() => null);
    }

    return updated;
  }

  async findAll(status?: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED') {
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

    // Calculate real-time usage stats for each subscription
    const enrichedSubscriptions = await Promise.all(
      subscriptions.map(async (sub) => {
        // Count listings created during subscription period (excluding rejected/deleted if necessary)
        const listingsCount = await this.prisma.listing.count({
          where: {
            ownerId: sub.userId,
            createdAt: {
              gte: sub.startDate,
              lte: sub.endDate,
            },
            status: { not: 'REJECTED' } // Assuming we count all valid attempts
          },
        });

        // Count approved stories during subscription period
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
      })
    );

    return enrichedSubscriptions;
  }

  async cancelSubscription(id: string) {
    return this.prisma.subscription.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async deleteSubscription(id: string) {
    return this.prisma.subscription.delete({
      where: { id },
    });
  }

  async updateSubscription(id: string, data: { endDate?: string | Date; status?: any; limits?: any }) {
    return this.prisma.subscription.update({
      where: { id },
      data: {
        ...data,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });
  }
}
