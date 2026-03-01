import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UserRole, ApprovalStatus, ServiceProviderType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class StoriesService {
  constructor(
      private prisma: PrismaService,
      private notificationsService: NotificationsService
  ) {}

  async create(userId: string, createStoryDto: CreateStoryDto) {
    // Expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return this.prisma.story.create({
      data: {
        userId,
        ...createStoryDto,
        expiresAt,
        status: ApprovalStatus.PENDING, // Default status
      },
    });
  }

  // Pending stories for admin moderation
  async findAllPending() {
    return this.prisma.story.findMany({
      where: {
        status: ApprovalStatus.PENDING,
        expiresAt: { gt: new Date() }, // Only if not expired (though unlikely for new ones)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            agency: { select: { logo: true, name: true } },
            showroom: { select: { logo: true, name: true } },
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Update status (Approve/Reject)
  async updateStatus(id: string, status: ApprovalStatus) {
      const story = await this.prisma.story.update({
          where: { id },
          data: { status },
          include: { user: true }
      });

      if (status === ApprovalStatus.APPROVED) {
        // Broadcast that a new story is available (maybe target followers in future, for now global)
        await this.notificationsService.broadcast(
            'STORY_APPROVED',
            { userName: story.user.name || 'User', storyId: story.id }
        );
      }

      return story;
  }

  async findAllActive(role?: 'AGENCY' | 'SHOWROOM' | 'INDIVIDUAL' | 'CUSTOMS_CLEARER' | 'INSPECTION_CENTER' | 'POLISHING_CENTER') {
    const now = new Date();
    
    // Construct user filter for the where clause
    let userFilter: any = undefined;
    if (role === 'AGENCY') {
      userFilter = { role: UserRole.AGENCY };
    } else if (role === 'SHOWROOM') {
      userFilter = { role: UserRole.SHOWROOM };
    } else if (role === 'INDIVIDUAL') {
      userFilter = { role: { in: [UserRole.INDIVIDUAL, UserRole.TRADER] } };
    } else if (role === 'CUSTOMS_CLEARER') {
      userFilter = { role: UserRole.SERVICE_PROVIDER, serviceProvider: { type: ServiceProviderType.CUSTOMS_CLEARER } };
    } else if (role === 'INSPECTION_CENTER') {
      userFilter = { role: UserRole.SERVICE_PROVIDER, serviceProvider: { type: ServiceProviderType.INSPECTION_CENTER } };
    } else if (role === 'POLISHING_CENTER') {
      userFilter = { role: UserRole.SERVICE_PROVIDER, serviceProvider: { type: ServiceProviderType.POLISHING_CENTER } };
    }

    return this.prisma.story.findMany({
      where: {
        expiresAt: { gt: now },
        status: ApprovalStatus.APPROVED,
        user: userFilter,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            agency: { select: { logo: true, name: true, coverImage: true } },
            showroom: { select: { logo: true, name: true, coverImage: true } },
            serviceProvider: { select: { type: true, name: true, nameAr: true, logo: true } },
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findMyStories(userId: string) {
      return this.prisma.story.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' }
      });
  }
}
