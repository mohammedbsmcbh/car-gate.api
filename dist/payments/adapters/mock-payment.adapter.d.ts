import { PaymentAdapter, PaymentResult } from './payment-adapter.interface';
export declare class MockPaymentAdapter implements PaymentAdapter {
    processPayment(amount: number, currency: string, metadata: any): Promise<PaymentResult>;
}
