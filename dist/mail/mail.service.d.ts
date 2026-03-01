import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendRegistrationConfirmation(to: string, userName: string): Promise<void>;
    sendApprovalEmail(to: string, userName: string): Promise<void>;
    sendRejectionEmail(to: string, userName: string, reason?: string): Promise<void>;
    sendOtpEmail(to: string, otp: string): Promise<void>;
    sendListingApprovedEmail(to: string, userName: string, listingTitle: string, listingId: string): Promise<void>;
    sendListingRejectedEmail(to: string, userName: string, listingTitle: string, reason?: string): Promise<void>;
    sendSubscriptionPendingEmail(to: string, userName: string, packageName: string): Promise<void>;
    sendSubscriptionActivatedEmail(to: string, userName: string, packageName: string, endDate: Date): Promise<void>;
    sendSubscriptionCancelledEmail(to: string, userName: string, packageName: string): Promise<void>;
    private sendEmail;
}
