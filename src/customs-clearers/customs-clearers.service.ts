import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomsClearerDto } from './dto/create-customs-clearer.dto';
import { configureCloudinary, cloudinary } from '../media/cloudinary.config';

@Injectable()
export class CustomsClearersService {
  constructor(private prisma: PrismaService) {
    configureCloudinary();
  }

  async create(createdById: string, dto: CreateCustomsClearerDto) {
    let imageUrl: string | undefined;

    if (dto.image) {
      try {
        const result = await cloudinary.uploader.upload(dto.image, {
          folder: `car-gate/customs-clearers/${createdById}`,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        });
        imageUrl = result.secure_url;
      } catch (e) {
        throw new BadRequestException('Failed to upload image');
      }
    }

    const { image, ...data } = dto;

    return this.prisma.customsClearer.create({
      data: {
        ...data,
        imageUrl,
        createdById,
      },
    });
  }

  findAllPublic() {
    return this.prisma.customsClearer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
