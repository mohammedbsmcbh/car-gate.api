import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateShowroomDto,
  UpdateShowroomDto,
  CreateSubAdminDto,
  ShowroomFilterDto,
} from './dto';
import { ListingStatus, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class ShowroomsService {
  constructor(
    private prisma: PrismaService,
    private auditLogs: AuditLogsService,
  ) {}

  async create(dto: CreateShowroomDto, userId: string) {
    // Check if user already has a showroom
    const existing = await this.prisma.showroom.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('User already has a showroom');
    }

    const showroom = await this.prisma.showroom.create({
      data: {
        ...dto,
        userId,
      },
    });

    return showroom;
  }

  async findAll(filters: ShowroomFilterDto, page = 1, limit = 20) {
    const where: Prisma.ShowroomWhereInput = {};

    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters.isApproved !== undefined) {
      where.isApproved = filters.isApproved;
    }

    if (filters.isVerified !== undefined) {
      where.isVerified = filters.isVerified;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { nameAr: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [showrooms, total] = await Promise.all([
      this.prisma.showroom.findMany({
        where,
        include: {
          user: {
            select: { 
              id: true, 
              name: true, 
              phone: true,
              subscriptions: {
                where: {
                  status: 'ACTIVE',
                  endDate: { gt: new Date() },
                },
                include: {
                  package: true
                },
                take: 1
              }
            },
          },
          _count: {
            select: { listings: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.showroom.count({ where }),
    ]);

    // Map to add isFeatured flag and sort featured to top
    const mappedShowrooms = showrooms.map((showroom) => {
        const activeSub = showroom.user.subscriptions?.[0];
        // Check if package has priorityListing feature
        // Note: features is a JsonValue, so we need to treat it safely
        const features = activeSub?.package?.features as any;
        const isFeatured = !!features?.priorityListing;
        
        return {
            ...showroom,
            isFeatured
        };
    });

    // Sort featured first
    const sortedShowrooms = mappedShowrooms.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
    });

    return {
      data: sortedShowrooms,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const showroom = await this.prisma.showroom.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, phone: true, whatsapp: true, email: true },
        },
        subAdmins: {
          select: { id: true, name: true, email: true, isActive: true, createdAt: true },
        },
        listings: {
          where: { status: ListingStatus.APPROVED },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            media: { where: { isPrimary: true }, take: 1 },
          },
        },
        _count: {
          select: { listings: true, subAdmins: true },
        },
      },
    });

    if (!showroom) {
      throw new NotFoundException('Showroom not found');
    }

    return showroom;
  }

  async findByUserId(userId: string) {
    // Attempt to find showroom by owner ID OR by subAdmin ID
    const showroom = await this.prisma.showroom.findFirst({
      where: {
        OR: [
            { userId: userId },
            { subAdmins: { some: { id: userId } } }
        ]
      },
      include: {
        subAdmins: {
          select: { id: true, email: true, name: true, isActive: true },
        },
        _count: {
          select: { listings: true },
        },
      },
    });

    if (!showroom) {
      throw new NotFoundException('Showroom not found');
    }

    return showroom;
  }

  async update(id: string, dto: UpdateShowroomDto, userId: string) {
    const showroom = await this.prisma.showroom.findUnique({
      where: { id },
    });

    if (!showroom) {
      throw new NotFoundException('Showroom not found');
    }

    if (showroom.userId !== userId) {
      throw new ForbiddenException('Cannot update this showroom');
    }

    return this.prisma.showroom.update({
      where: { id },
      data: dto,
    });
  }

  async approve(id: string, approved: boolean, adminId: string) {
    const showroom = await this.prisma.showroom.update({
      where: { id },
      data: { isApproved: approved },
    });

    // Also update user approval status and activate account
    await this.prisma.user.update({
      where: { id: showroom.userId },
      data: { 
        isApproved: approved,
        isActive: approved ? true : undefined // Only activate on approval, don't auto-deactivate on un-approve (unless desired behavior)
      },
    });

    await this.auditLogs.log({
      actorId: adminId,
      action: approved ? 'SHOWROOM_APPROVED' : 'SHOWROOM_REJECTED',
      entityType: 'Showroom',
      entityId: id,
      metadata: { userId: showroom.userId },
    });

    return showroom;
  }

  // Sub-admin management
  async addSubAdmin(showroomId: string, dto: CreateSubAdminDto, userId: string) {
    const showroom = await this.prisma.showroom.findUnique({
      where: { id: showroomId },
    });

    if (!showroom || showroom.userId !== userId) {
      throw new ForbiddenException('Cannot manage this showroom');
    }

    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const subAdmin = await this.prisma.showroomSubAdmin.create({
        data: {
          showroomId,
          email: dto.email,
          name: dto.name,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
        },
      });

      return subAdmin;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('A team member with this email already exists');
      }
      throw error;
    }
  }

  async removeSubAdmin(showroomId: string, subAdminId: string, userId: string) {
    const showroom = await this.prisma.showroom.findUnique({
      where: { id: showroomId },
    });

    if (!showroom || showroom.userId !== userId) {
      throw new ForbiddenException('Cannot manage this showroom');
    }

    await this.prisma.showroomSubAdmin.delete({
      where: { id: subAdminId },
    });

    return { message: 'Sub-admin removed successfully' };
  }

  async getSubAdmins(showroomId: string, userId: string) {
    const showroom = await this.prisma.showroom.findUnique({
      where: { id: showroomId },
      include: { subAdmins: true }, // Need to load subAdmins to check permission if not owner
    });

    if (!showroom) {
      throw new ForbiddenException('Showroom not found');
    }

    // Allow access if User is Owner OR User is one of the Sub-Admins
    const isOwner = showroom.userId === userId;
    const isSubAdmin = showroom.subAdmins.some(sa => sa.id === userId);

    if (!isOwner && !isSubAdmin) {
      throw new ForbiddenException('Cannot view this showroom');
    }

    return this.prisma.showroomSubAdmin.findMany({
      where: { showroomId },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async remove(id: string) {
    const showroom = await this.prisma.showroom.findUnique({
      where: { id },
    });

    if (!showroom) {
      throw new NotFoundException('Showroom not found');
    }

    await this.prisma.showroom.delete({
      where: { id },
    });

    return { message: 'Showroom deleted successfully' };
  }
}
