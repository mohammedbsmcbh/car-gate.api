import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MockPaymentAdapter } from './adapters/mock-payment.adapter';
export declare class PaymentsService {
    private prisma;
    private paymentAdapter;
    constructor(prisma: PrismaService, paymentAdapter: MockPaymentAdapter);
    createPayment(userId: string, dto: CreatePaymentDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        userId: string;
        listingId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        currency: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        packageId: string | null;
        featuredPricingId: string | null;
        reference: string | null;
        subscriptionId: string | null;
    }>;
    private activatePackageSubscription;
    private activateFeaturedListing;
    getUserTransactions(userId: string): Promise<({
        listing: {
            id: string;
            title: string;
        } | null;
        featuredPricing: {
            name: string;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        userId: string;
        listingId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        currency: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        packageId: string | null;
        featuredPricingId: string | null;
        reference: string | null;
        subscriptionId: string | null;
    })[]>;
    getFeaturedPlans(): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        days: number;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
    }[]>;
}
