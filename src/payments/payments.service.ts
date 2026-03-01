import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// Re-trigger TS check
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MockPaymentAdapter } from './adapters/mock-payment.adapter';
import { TransactionStatus, TransactionType } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private paymentAdapter: MockPaymentAdapter,
  ) {}

  async createPayment(userId: string, dto: CreatePaymentDto) {
    let amount = 0;
    let description = '';

    // Calculate amount based on type
    if (dto.type === TransactionType.FEATURED_LISTING) {
      if (!dto.featuredPricingId || !dto.listingId) {
        throw new BadRequestException('Featured pricing ID and Listing ID are required for featured listing payment');
      }

      const pricing = await this.prisma.featuredPricing.findUnique({
        where: { id: dto.featuredPricingId },
      });

      if (!pricing) {
        throw new NotFoundException('Featured pricing plan not found');
      }

      amount = Number(pricing.price);
      description = `Featured Listing: ${pricing.name}`;
    } else if (dto.type === TransactionType.PACKAGE_SUBSCRIPTION) {
       if (!dto.packageId) {
         throw new BadRequestException('Package ID is required for package subscription');
       }

       const pkg = await this.prisma.package.findUnique({
         where: { id: dto.packageId },
       });

       if (!pkg) {
         throw new NotFoundException('Package not found');
       }

       if (!pkg.isActive) {
         throw new BadRequestException('This package is not currently active');
       }

       amount = Number(pkg.price);
       description = `Subscription: ${pkg.nameEn}`;
    } else {
      throw new BadRequestException('Unsupported transaction type');
    }

    // Create pending transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        amount,
        currency: 'BHD',
        status: TransactionStatus.PENDING,
        type: dto.type,
        listingId: dto.listingId,
        featuredPricingId: dto.featuredPricingId,
        packageId: dto.packageId,
        metadata: { description },
      },
    });

    // Process payment
    const result = await this.paymentAdapter.processPayment(amount, 'BHD', {
      transactionId: transaction.id,
      userId,
      description,
    });

    // Update transaction status
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: result.success ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
        reference: result.transactionId,
        metadata: {
          ...(transaction.metadata as object),
          paymentResult: result,
        } as any,
      },
    });

    // If success, apply the benefit (e.g., feature the listing)
    if (result.success) {
      if (dto.type === TransactionType.FEATURED_LISTING) {
        await this.activateFeaturedListing(dto.listingId!, dto.featuredPricingId!);
      } else if (dto.type === TransactionType.PACKAGE_SUBSCRIPTION) {
        await this.activatePackageSubscription(userId, dto.packageId!, transaction.id);
      }
    }

    return updatedTransaction;
  }

  private async activatePackageSubscription(userId: string, packageId: string, transactionId: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) return;

    // Use Package Features to determine duration
    // Default to 30 days if not specified
    const features = pkg.features as any;
    const durationDays = features.durationDays || 30;

    const now = new Date();
    const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // Expire any existing active subscriptions for this user?
    // Usually, we might want to expire old ones or stack them.
    // For simplicity, we'll mark old active ones as CANCELLED or EXPIRED.
    await this.prisma.subscription.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'CANCELLED' }
    });

    // Create new subscription
    const sub = await this.prisma.subscription.create({
      data: {
        userId,
        packageId,
        startDate: now,
        endDate,
        status: 'ACTIVE',
        limits: pkg.features as any,
        listingsUsed: 0,
        storiesUsed: 0,
      }
    });

    // 2. Update Transaction with subscriptionId
    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { subscriptionId: sub.id }
    });
  }

  private async activateFeaturedListing(listingId: string, pricingId: string) {
    const pricing = await this.prisma.featuredPricing.findUnique({
      where: { id: pricingId },
    });

    if (!pricing) return;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + pricing.days * 24 * 60 * 60 * 1000);

    await this.prisma.listing.update({
      where: { id: listingId },
      data: {
        isFeatured: true,
        featuredStartsAt: now,
        featuredUntil: expiresAt,
        featuredPrice: pricing.price,
      },
    });
  }

  async getUserTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          select: { title: true, id: true }
        },
        featuredPricing: {
          select: { name: true }
        }
      }
    });
  }

  async getFeaturedPlans() {
    const plans = await this.prisma.featuredPricing.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });

    if (plans.length === 0) {
      // Seed default plans if none exist
      await this.prisma.featuredPricing.createMany({
        data: [
          { name: '7 Days Boost', days: 7, price: 5.00, currency: 'BHD' },
          { name: '14 Days Boost', days: 14, price: 9.00, currency: 'BHD' },
          { name: '30 Days Ultimate', days: 30, price: 15.00, currency: 'BHD' },
        ],
      });
      return this.prisma.featuredPricing.findMany({
        where: { isActive: true },
        orderBy: { price: 'asc' },
      });
    }

    return plans;
  }
}
// Force update
