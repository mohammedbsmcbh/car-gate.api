import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackageTarget, Prisma } from '@prisma/client';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async create(createPackageDto: CreatePackageDto) {
    // Check for duplicates
    const orConditions: Prisma.PackageWhereInput[] = [
      { nameEn: { equals: createPackageDto.nameEn, mode: 'insensitive' } },
      { nameAr: { equals: createPackageDto.nameAr, mode: 'insensitive' } },
    ];

    if (createPackageDto.nameUr) {
      orConditions.push({ nameUr: { equals: createPackageDto.nameUr, mode: 'insensitive' } });
    }

    const existing = await this.prisma.package.findFirst({
      where: {
        OR: orConditions,
      },
    });

    if (existing) {
      throw new BadRequestException('A package with this name already exists.');
    }

    // Ensure features object is valid JSON compatible
    const features = createPackageDto.features as Prisma.JsonObject;

    return this.prisma.package.create({
      data: {
        ...createPackageDto,
        features,
      },
    });
  }

  async findAll(search?: string, billingType?: string, role?: string) {
    const where: Prisma.PackageWhereInput = {};

    if (search) {
      where.OR = [
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (billingType) {
      where.billingType = billingType as any;
    }

    // Validate and map role -> targetAudience to avoid invalid enum errors (e.g., SERVICE_PROVIDER not in PackageTarget)
    let audienceRole: PackageTarget | undefined;
    if (role && role !== 'SUPER_ADMIN') {
      if (role === 'SERVICE_PROVIDER') {
        // Map service providers to the closest existing audience bucket
        audienceRole = PackageTarget.INDIVIDUAL;
      } else if (Object.values(PackageTarget).includes(role as PackageTarget)) {
        audienceRole = role as PackageTarget;
      }
    }

    if (audienceRole) {
      // Filter for end-users
      where.isActive = true;
      where.OR = [
        { targetAudience: PackageTarget.ALL },
        { targetAudience: audienceRole },
      ];
    } else if (!role) {
      // Default for public/guests: only show publicly available packages
      where.isActive = true;
      where.targetAudience = PackageTarget.ALL;
    }

    return this.prisma.package.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const pkg = await this.prisma.package.findUnique({ where: { id } });
    if (!pkg) throw new NotFoundException('Package not found');
    return pkg;
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    const pkg = await this.findOne(id);

    if (updatePackageDto.nameEn || updatePackageDto.nameAr || updatePackageDto.nameUr) {
      const orConditions: Prisma.PackageWhereInput[] = [];
      
      if (updatePackageDto.nameEn) orConditions.push({ nameEn: { equals: updatePackageDto.nameEn, mode: 'insensitive' } });
      if (updatePackageDto.nameAr) orConditions.push({ nameAr: { equals: updatePackageDto.nameAr, mode: 'insensitive' } });
      if (updatePackageDto.nameUr) orConditions.push({ nameUr: { equals: updatePackageDto.nameUr, mode: 'insensitive' } });

      const existing = await this.prisma.package.findFirst({
        where: {
          id: { not: id },
          OR: orConditions,
        },
      });

      if (existing) {
        throw new BadRequestException('A package with this name already exists.');
      }
    }

    const features = updatePackageDto.features 
      ? (updatePackageDto.features as Prisma.JsonObject) 
      : undefined;

    return this.prisma.package.update({
      where: { id },
      data: {
        ...updatePackageDto,
        features,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Add logic here to check if package is in use if needed
    return this.prisma.package.delete({ where: { id } });
  }
}
