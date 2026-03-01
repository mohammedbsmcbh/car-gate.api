import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(req: any, createPaymentDto: CreatePaymentDto): Promise<{
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
    findAll(req: any): Promise<({
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
    getPlans(): Promise<{
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
