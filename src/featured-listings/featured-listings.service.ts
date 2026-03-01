import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeaturedListingDto, UpdateFeaturedListingDto } from './dto';
import { ListingStatus, UserRole } from '@prisma/client';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class FeaturedListingsService {
  constructor(
    private prisma: PrismaService,
    private auditLogs: AuditLogsService,
  ) {}

  async create(dto: CreateFeaturedListingDto, userId: string, userRole: UserRole) {
    // Check if listing exists
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Admin-controlled activation
    if (userRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admin can feature listings');
    }

    // Check if listing is approved
    if (listing.status !== ListingStatus.APPROVED) {
      // throw new BadRequestException('Only approved listings can be featured');
      // For Super Admin, we allow featuring even if not approved yet, or warn? 
      // For now, let's strictly enforce approval because featured logic usually depends on it being public.
      // But user said "at any time". Let's removing this check for Super Admin.
    }

    // Calculate expiration date
    const startsAt = dto.startsAt ? new Date(dto.startsAt) : new Date();
    const expiresAt = new Date(startsAt);
    expiresAt.setDate(expiresAt.getDate() + dto.days);

    // Update listing
    const updatedListing = await this.prisma.listing.update({
      where: { id: dto.listingId },
      data: {
        isFeatured: true,
        featuredStartsAt: startsAt,
        featuredUntil: expiresAt,
        featuredPrice: dto.price,
        featuredPriority: dto.priority ?? 0,
      },
      include: {
        media: true,
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await this.auditLogs.log({
      actorId: userId,
      action: 'FEATURED_ACTIVATED',
      entityType: 'Listing',
      entityId: dto.listingId,
      metadata: {
        startsAt: startsAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        price: dto.price ?? null,
        priority: dto.priority ?? 0,
      },
    });

    return updatedListing;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.listing.findMany({
        where: {
          isFeatured: true,
          featuredUntil: {
            gte: new Date(),
          },
          status: ListingStatus.APPROVED,
        },
        include: {
          media: { where: { isPrimary: true }, take: 1 },
          owner: {
            select: { id: true, name: true },
          },
          agency: {
            select: { id: true, name: true, logo: true },
          },
          showroom: {
            select: { id: true, name: true, logo: true },
          },
        },
        skip,
        take: limit,
        orderBy: [
          { featuredPriority: 'desc' },
          { featuredUntil: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      this.prisma.listing.count({
        where: {
          isFeatured: true,
          featuredUntil: {
            gte: new Date(),
          },
          status: ListingStatus.APPROVED,
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        media: true,
        owner: {
          select: { id: true, name: true, phone: true, email: true },
        },
        agency: true,
        showroom: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (!listing.isFeatured) {
      throw new BadRequestException('This listing is not featured');
    }

    return listing;
  }

  async update(listingId: string, dto: UpdateFeaturedListingDto, userId: string, userRole: UserRole) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Admin-controlled activation
    if (userRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admin can update featured listings');
    }

    const updateData: any = {};

    if (dto.isActive !== undefined) {
      updateData.isFeatured = dto.isActive;
      if (!dto.isActive) {
        updateData.featuredUntil = null;
        updateData.featuredPrice = null;
      }
    }

    if (dto.expiresAt) {
      updateData.featuredUntil = new Date(dto.expiresAt);
    }

    if (dto.priority !== undefined) {
      updateData.featuredPriority = dto.priority;
    }

    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: updateData,
    });

    await this.auditLogs.log({
      actorId: userId,
      action: 'FEATURED_UPDATED',
      entityType: 'Listing',
      entityId: listingId,
      metadata: {
        isActive: dto.isActive ?? null,
        expiresAt: dto.expiresAt ?? null,
        priority: dto.priority ?? null,
      },
    });

    return updated;
  }

  async remove(listingId: string, userId: string, userRole: UserRole) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Admin-controlled activation
    if (userRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admin can remove featured status');
    }

    await this.prisma.listing.update({
      where: { id: listingId },
      data: {
        isFeatured: false,
        featuredStartsAt: null,
        featuredUntil: null,
        featuredPrice: null,
        featuredPriority: 0,
      },
    });

    await this.auditLogs.log({
      actorId: userId,
      action: 'FEATURED_REMOVED',
      entityType: 'Listing',
      entityId: listingId,
    });

    return { message: 'Featured status removed successfully' };
  }

  // Cleanup expired featured listings
  async cleanupExpired() {
    const result = await this.prisma.listing.updateMany({
      where: {
        isFeatured: true,
        featuredUntil: {
          lt: new Date(),
        },
      },
      data: {
        isFeatured: false,
        featuredStartsAt: null,
        featuredPriority: 0,
      },
    });

    return { count: result.count };
  }
}
