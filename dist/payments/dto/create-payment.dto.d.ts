import { TransactionType } from '@prisma/client';
export declare class CreatePaymentDto {
    type: TransactionType;
    listingId?: string;
    featuredPricingId?: string;
    packageId?: string;
}
