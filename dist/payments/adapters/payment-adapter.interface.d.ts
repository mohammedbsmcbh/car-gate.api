export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    message?: string;
    metadata?: any;
}
export interface PaymentAdapter {
    processPayment(amount: number, currency: string, metadata: any): Promise<PaymentResult>;
}
