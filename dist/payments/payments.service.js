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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mock_payment_adapter_1 = require("./adapters/mock-payment.adapter");
const client_1 = require("@prisma/client");
let PaymentsService = class PaymentsService {
    prisma;
    paymentAdapter;
    constructor(prisma, paymentAdapter) {
        this.prisma = prisma;
        this.paymentAdapter = paymentAdapter;
    }
    async createPayment(userId, dto) {
        let amount = 0;
        let description = '';
        if (dto.type === client_1.TransactionType.FEATURED_LISTING) {
            if (!dto.featuredPricingId || !dto.listingId) {
                throw new common_1.BadRequestException('Featured pricing ID and Listing ID are required for featured listing payment');
            }
            const pricing = await this.prisma.featuredPricing.findUnique({
                where: { id: dto.featuredPricingId },
            });
            if (!pricing) {
                throw new common_1.NotFoundException('Featured pricing plan not found');
            }
            amount = Number(pricing.price);
            description = `Featured Listing: ${pricing.name}`;
        }
        else if (dto.type === client_1.TransactionType.PACKAGE_SUBSCRIPTION) {
            if (!dto.packageId) {
                throw new common_1.BadRequestException('Package ID is required for package subscription');
            }
            const pkg = await this.prisma.package.findUnique({
                where: { id: dto.packageId },
            });
            if (!pkg) {
                throw new common_1.NotFoundException('Package not found');
            }
            if (!pkg.isActive) {
                throw new common_1.BadRequestException('This package is not currently active');
            }
            amount = Number(pkg.price);
            description = `Subscription: ${pkg.nameEn}`;
        }
        else {
            throw new common_1.BadRequestException('Unsupported transaction type');
        }
        const transaction = await this.prisma.transaction.create({
            data: {
                userId,
                amount,
                currency: 'BHD',
                status: client_1.TransactionStatus.PENDING,
                type: dto.type,
                listingId: dto.listingId,
                featuredPricingId: dto.featuredPricingId,
                packageId: dto.packageId,
                metadata: { description },
            },
        });
        const result = await this.paymentAdapter.processPayment(amount, 'BHD', {
            transactionId: transaction.id,
            userId,
            description,
        });
        const updatedTransaction = await this.prisma.transaction.update({
            where: { id: transaction.id },
            data: {
                status: result.success ? client_1.TransactionStatus.SUCCESS : client_1.TransactionStatus.FAILED,
                reference: result.transactionId,
                metadata: {
                    ...transaction.metadata,
                    paymentResult: result,
                },
            },
        });
        if (result.success) {
            if (dto.type === client_1.TransactionType.FEATURED_LISTING) {
                await this.activateFeaturedListing(dto.listingId, dto.featuredPricingId);
            }
            else if (dto.type === client_1.TransactionType.PACKAGE_SUBSCRIPTION) {
                await this.activatePackageSubscription(userId, dto.packageId, transaction.id);
            }
        }
        return updatedTransaction;
    }
    async activatePackageSubscription(userId, packageId, transactionId) {
        const pkg = await this.prisma.package.findUnique({
            where: { id: packageId },
        });
        if (!pkg)
            return;
        const features = pkg.features;
        const durationDays = features.durationDays || 30;
        const now = new Date();
        const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
        await this.prisma.subscription.updateMany({
            where: { userId, status: 'ACTIVE' },
            data: { status: 'CANCELLED' }
        });
        const sub = await this.prisma.subscription.create({
            data: {
                userId,
                packageId,
                startDate: now,
                endDate,
                status: 'ACTIVE',
                limits: pkg.features,
                listingsUsed: 0,
                storiesUsed: 0,
            }
        });
        await this.prisma.transaction.update({
            where: { id: transactionId },
            data: { subscriptionId: sub.id }
        });
    }
    async activateFeaturedListing(listingId, pricingId) {
        const pricing = await this.prisma.featuredPricing.findUnique({
            where: { id: pricingId },
        });
        if (!pricing)
            return;
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
    async getUserTransactions(userId) {
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mock_payment_adapter_1.MockPaymentAdapter])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map