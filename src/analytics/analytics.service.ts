import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, ListingStatus, ComplaintStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // Parallelize all count queries for performance
    const [
      totalUsers,
      pendingUsers,
      agencies,
      showrooms,
      totalListings,
      pendingListings,
      featuredListings,
      openComplaints,
      unreadInquiries,
      recentActivity
    ] = await Promise.all([
      // 1. Total Users
      this.prisma.user.count(),
      // 2. Pending Users (Approvals)
      this.prisma.user.count({ where: { isApproved: false, role: { not: UserRole.SUPER_ADMIN } } }),
      // 3. Agencies
      this.prisma.agency.count(),
      // 4. Showrooms
      this.prisma.showroom.count(),
      // 5. Total Listings
      this.prisma.listing.count(),
      // 6. Pending Listings
      this.prisma.listing.count({ where: { status: ListingStatus.PENDING } }),
      // 7. Featured Listings
      this.prisma.listing.count({ where: { isFeatured: true } }),
      // 8. Open Complaints
      this.prisma.complaint.count({ where: { status: ComplaintStatus.OPEN } }),
      // 9. Unread Inquiries (System wide or just generally impactful ones? Let's generic count)
      this.prisma.inquiryMessage.count({ where: { isRead: false } }),
      // 10. Recent Activity (New Registrations)
      this.prisma.user.findMany({
        where: { isApproved: false, role: { not: UserRole.SUPER_ADMIN } },
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

    // Breakdown pending by role
    const pendingByRole = await this.prisma.user.groupBy({
        by: ['role'],
        where: { isApproved: false, role: { not: UserRole.SUPER_ADMIN } },
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
        if (group.role === UserRole.AGENCY) pendingCounts.agencies = group._count.role;
        else if (group.role === UserRole.SHOWROOM) pendingCounts.showrooms = group._count.role;
        else if (group.role === UserRole.TRADER) pendingCounts.traders = group._count.role;
        else if (group.role === UserRole.INDIVIDUAL) pendingCounts.individuals = group._count.role;
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
}
