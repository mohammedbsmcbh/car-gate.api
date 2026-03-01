import { Injectable } from '@nestjs/common';
import { PaymentAdapter, PaymentResult } from './payment-adapter.interface';

@Injectable()
export class MockPaymentAdapter implements PaymentAdapter {
  async processPayment(amount: number, currency: string, metadata: any): Promise<PaymentResult> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Always return success for now
    return {
      success: true,
      transactionId: `mock_${Date.now()}`,
      message: 'Payment processed successfully (Mock)',
      metadata: {
        provider: 'mock',
        amount,
        currency,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
