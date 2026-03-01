import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
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
