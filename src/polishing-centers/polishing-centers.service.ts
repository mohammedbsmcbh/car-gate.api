import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePolishingCenterDto } from './dto/create-polishing-center.dto';
import { UpdatePolishingCenterDto } from './dto/update-polishing-center.dto';

@Injectable()
export class PolishingCentersService {
  constructor(private prisma: PrismaService) {}

  create(createPolishingCenterDto: CreatePolishingCenterDto) {
    return this.prisma.polishingCenter.create({
      data: createPolishingCenterDto,
    });
  }

  findAll() {
    return this.prisma.polishingCenter.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  findAllAdmin() {
    return this.prisma.polishingCenter.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const center = await this.prisma.polishingCenter.findUnique({
      where: { id },
    });

    if (!center) {
      throw new NotFoundException('Polishing center not found');
    }

    return center;
  }

  async update(id: string, updatePolishingCenterDto: UpdatePolishingCenterDto) {
    await this.findOne(id);
    return this.prisma.polishingCenter.update({
      where: { id },
      data: updatePolishingCenterDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.polishingCenter.delete({ where: { id } });
  }
}
