import {
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchListings(query: string, filters: any = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: Prisma.ListingWhereInput = {
      status: 'APPROVED',
    };

    // Search query
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { titleAr: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { descriptionAr: { contains: query, mode: 'insensitive' } },
        { make: { contains: query, mode: 'insensitive' } },
        { model: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Filters
    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.make) {
      where.make = { contains: filters.make, mode: 'insensitive' };
    }

    if (filters.model) {
      where.model = { contains: filters.model, mode: 'insensitive' };
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      where.price = { gte: filters.minPrice, lte: filters.maxPrice };
    } else if (filters.minPrice !== undefined) {
      where.price = { gte: filters.minPrice };
    } else if (filters.maxPrice !== undefined) {
      where.price = { lte: filters.maxPrice };
    }

    if (filters.minYear !== undefined && filters.maxYear !== undefined) {
      where.year = { gte: filters.minYear, lte: filters.maxYear };
    } else if (filters.minYear !== undefined) {
      where.year = { gte: filters.minYear };
    } else if (filters.maxYear !== undefined) {
      where.year = { lte: filters.maxYear };
    }

    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters.condition) {
      where.condition = filters.condition;
    }

    if (filters.transmission) {
      where.transmission = filters.transmission;
    }

    if (filters.fuelType) {
      where.fuelType = filters.fuelType;
    }

    if (filters.bodyType) {
      where.bodyType = filters.bodyType;
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    const [data, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
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
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      this.prisma.listing.count({ where }),
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

  async searchAgencies(query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: Prisma.AgencyWhereInput = {
      isApproved: true,
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { nameAr: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.agency.findMany({
        where,
        include: {
          _count: {
            select: { listings: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.agency.count({ where }),
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

  async searchShowrooms(query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: Prisma.ShowroomWhereInput = {
      isApproved: true,
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { nameAr: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.showroom.findMany({
        where,
        include: {
          _count: {
            select: { listings: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.showroom.count({ where }),
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

  async globalSearch(query: string, page = 1, limit = 10) {
    // Perform parallel searches across entities
    const [listings, agencies, showrooms] = await Promise.all([
      this.searchListings(query, {}, 1, limit),
      this.searchAgencies(query, 1, limit),
      this.searchShowrooms(query, 1, limit),
    ]);

    return {
      listings: listings.data,
      agencies: agencies.data,
      showrooms: showrooms.data,
      totals: {
        listings: listings.meta.total,
        agencies: agencies.meta.total,
        showrooms: showrooms.meta.total,
      },
    };
  }

  // Location-based search
  async searchNearby(latitude: number, longitude: number, radiusKm = 10, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Simple distance calculation using Haversine formula approximation
    // For production, consider using PostGIS for better performance
    const listings = await this.prisma.$queryRaw<any[]>`
      SELECT l.*, 
        (6371 * acos(cos(radians(${latitude})) * cos(radians(l.latitude)) * 
        cos(radians(l.longitude) - radians(${longitude})) + 
        sin(radians(${latitude})) * sin(radians(l.latitude)))) AS distance
      FROM "Listing" l
      WHERE l.status = 'APPROVED'
        AND l.latitude IS NOT NULL
        AND l.longitude IS NOT NULL
      HAVING distance < ${radiusKm}
      ORDER BY distance
      LIMIT ${limit}
      OFFSET ${skip}
    `;

    const total = listings.length;

    return {
      data: listings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
