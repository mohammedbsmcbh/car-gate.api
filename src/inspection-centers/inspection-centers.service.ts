import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInspectionCenterDto } from './dto/create-inspection-center.dto';
import { UpdateInspectionCenterDto } from './dto/update-inspection-center.dto';

@Injectable()
export class InspectionCentersService {
  constructor(private prisma: PrismaService) {}

  create(createInspectionCenterDto: CreateInspectionCenterDto) {
    return this.prisma.inspectionCenter.create({
      data: createInspectionCenterDto,
    });
  }

  findAll() {
    return this.prisma.inspectionCenter.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  findAllAdmin() {
    return this.prisma.inspectionCenter.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const center = await this.prisma.inspectionCenter.findUnique({
      where: { id },
    });

    if (!center) {
      throw new NotFoundException('Inspection center not found');
    }

    return center;
  }

  async update(id: string, updateInspectionCenterDto: UpdateInspectionCenterDto) {
    await this.findOne(id);
    return this.prisma.inspectionCenter.update({
      where: { id },
      data: updateInspectionCenterDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.inspectionCenter.delete({
      where: { id },
    });
  }
}
