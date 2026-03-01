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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, pendingUsers, agencies, showrooms, totalListings, pendingListings, featuredListings, openComplaints, unreadInquiries, recentActivity] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { isApproved: false, role: { not: client_1.UserRole.SUPER_ADMIN } } }),
            this.prisma.agency.count(),
            this.prisma.showroom.count(),
            this.prisma.listing.count(),
            this.prisma.listing.count({ where: { status: client_1.ListingStatus.PENDING } }),
            this.prisma.listing.count({ where: { isFeatured: true } }),
            this.prisma.complaint.count({ where: { status: client_1.ComplaintStatus.OPEN } }),
            this.prisma.inquiryMessage.count({ where: { isRead: false } }),
            this.prisma.user.findMany({
                where: { isApproved: false, role: { not: client_1.UserRole.SUPER_ADMIN } },
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                }
            })
        ]);
        const pendingByRole = await this.prisma.user.groupBy({
            by: ['role'],
            where: { isApproved: false, role: { not: client_1.UserRole.SUPER_ADMIN } },
            _count: {
                role: true
            }
        });
        const pendingCounts = {
            agencies: 0,
            showrooms: 0,
            traders: 0,
            individuals: 0,
            total: pendingUsers
        };
        pendingByRole.forEach(group => {
            if (group.role === client_1.UserRole.AGENCY)
                pendingCounts.agencies = group._count.role;
            else if (group.role === client_1.UserRole.SHOWROOM)
                pendingCounts.showrooms = group._count.role;
            else if (group.role === client_1.UserRole.TRADER)
                pendingCounts.traders = group._count.role;
            else if (group.role === client_1.UserRole.INDIVIDUAL)
                pendingCounts.individuals = group._count.role;
        });
        return {
            users: {
                total: totalUsers,
                agencies,
                showrooms,
            },
            pendingAccounts: pendingCounts,
            listings: {
                total: totalListings,
                pending: pendingListings,
                featured: featuredListings,
            },
            complaints: {
                open: openComplaints,
            },
            inquiries: {
                unread: unreadInquiries
            },
            recentActivity: recentActivity.map(user => ({
                id: user.id,
                type: 'registration',
                message: `${user.name || user.email} (${user.role}) registered and awaits approval.`,
                createdAt: user.createdAt
            }))
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map