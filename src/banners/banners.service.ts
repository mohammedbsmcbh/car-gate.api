import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { Language } from '@prisma/client';

@Injectable()
export class BannersService {
  constructor(
      private prisma: PrismaService,
      private notificationsService: NotificationsService,
  ) {}

  private inferMediaTypeFromUrl(mediaUrl: string) {
    const url = (mediaUrl || '').split('?')[0].toLowerCase();
    if (
      url.endsWith('.mp4') ||
      url.endsWith('.mov') ||
      url.endsWith('.m4v') ||
      url.endsWith('.webm') ||
      url.endsWith('.m3u8')
    ) {
      return 'VIDEO' as const;
    }

    return 'IMAGE' as const;
  }

  async create(dto: CreateBannerDto) {
    const mediaType = dto.mediaType ?? this.inferMediaTypeFromUrl(dto.mediaUrl);
    const banner = await this.prisma.banner.create({
      data: {
        ...dto,
        mediaType,
      },
    });

    if (banner.isActive) {
        await this.notificationsService.broadcast(
            'NEW_BANNER',
            { bannerTitle: banner.title, bannerId: banner.id },
            { 
               language: banner.language === Language.ALL ? undefined : banner.language 
            }
        );
    }
    
    return banner;
  }

  findAll(activeOnly = false, language?: string) {
    const where: any = {};
    
    if (activeOnly) {
      where.isActive = true;
    }

    if (language) {
      // Show banners for specific language OR banners meant for ALL languages
      where.language = {
        in: ['ALL', language.toUpperCase()]
      };
    }

    return this.prisma.banner.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    return banner;
  }

  async update(id: string, dto: UpdateBannerDto) {
    await this.findOne(id);

    const mediaType =
      dto.mediaType ?? (dto.mediaUrl ? this.inferMediaTypeFromUrl(dto.mediaUrl) : undefined);

    return this.prisma.banner.update({
      where: { id },
      data: {
        ...dto,
        ...(mediaType ? { mediaType } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.banner.delete({ where: { id } });
  }
}

