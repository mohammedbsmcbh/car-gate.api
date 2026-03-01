import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardStats(): Promise<{
        users: {
            total: number;
            agencies: number;
            showrooms: number;
        };
        pendingAccounts: {
            agencies: number;
            showrooms: number;
            traders: number;
            individuals: number;
            total: number;
        };
        listings: {
            total: number;
            pending: number;
            featured: number;
        };
        complaints: {
            open: number;
        };
        inquiries: {
            unread: number;
        };
        recentActivity: {
            id: string;
            type: string;
            message: string;
            createdAt: Date;
        }[];
    }>;
}
