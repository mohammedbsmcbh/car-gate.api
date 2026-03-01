import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateServiceProviderDto,
  UpdateServiceProviderDto,
  CreateServiceItemDto,
  UpdateServiceItemDto,
  CreateBookingDto,
  CreateServiceRequestDto,
} from './dto/service-provider.dto';
import { ApprovalStatus, ServiceProviderType } from '@prisma/client';

@Injectable()
export class ServiceProvidersService {
  constructor(private prisma: PrismaService) {}

  // ─── Public: list approved providers by type ───
  async findAll(type: ServiceProviderType, city?: string) {
    return this.prisma.serviceProvider.findMany({
      where: {
        type,
        isApproved: true,
        ...(city ? { city: { contains: city, mode: 'insensitive' } } : {}),
      },
      include: {
        services: {
          where: { isActive: true, status: ApprovalStatus.APPROVED },
          orderBy: { price: 'asc' },
        },
        user: { select: { name: true, phone: true, whatsapp: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Public: single provider ───
  async findOne(id: string) {
    const provider = await this.prisma.serviceProvider.findUnique({
      where: { id },
      include: {
        services: {
          where: { isActive: true, status: ApprovalStatus.APPROVED },
          orderBy: { price: 'asc' },
        },
        user: { select: { name: true, phone: true, whatsapp: true, email: true } },
      },
    });
    if (!provider || !provider.isApproved) throw new NotFoundException('Provider not found');
    return provider;
  }

  // ─── Auth: get my profile ───
  async findMyProfile(userId: string) {
    return this.prisma.serviceProvider.findUnique({
      where: { userId },
      include: {
        services: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  // ─── Auth: create or update profile ───
  async upsertProfile(userId: string, dto: CreateServiceProviderDto) {
    const existing = await this.prisma.serviceProvider.findUnique({ where: { userId } });

    if (existing) {
      // Update
      return this.prisma.serviceProvider.update({
        where: { userId },
        data: {
          name: dto.name,
          nameAr: dto.nameAr,
          description: dto.description,
          city: dto.city,
          address: dto.address,
          phone: dto.phone,
          whatsapp: dto.whatsapp,
          logo: dto.logo,
          latitude: dto.latitude,
          longitude: dto.longitude,
        },
        include: { services: true },
      });
    }

    // Create
    return this.prisma.serviceProvider.create({
      data: {
        userId,
        type: dto.type,
        name: dto.name,
        nameAr: dto.nameAr,
        description: dto.description,
        city: dto.city,
        address: dto.address,
        phone: dto.phone,
        whatsapp: dto.whatsapp,
        logo: dto.logo,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
      include: { services: true },
    });
  }

  // ─── Auth: update profile ───
  async updateProfile(userId: string, dto: UpdateServiceProviderDto) {
    const existing = await this.prisma.serviceProvider.findUnique({ where: { userId } });
    if (!existing) throw new NotFoundException('Profile not found. Please create your profile first.');

    return this.prisma.serviceProvider.update({
      where: { userId },
      data: dto,
      include: { services: true },
    });
  }

  // ─── Auth: add service item (requires admin approval) ───
  async addService(userId: string, dto: CreateServiceItemDto) {
    const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
    if (!provider) throw new NotFoundException('Please create your provider profile first.');

    return this.prisma.serviceItem.create({
      data: {
        serviceProviderId: provider.id,
        nameEn: dto.nameEn,
        nameAr: dto.nameAr,
        description: dto.description,
        price: dto.price,
        duration: dto.duration,
        status: ApprovalStatus.PENDING,
      },
    });
  }

  // ─── Auth: update service item (reset to PENDING for re-approval) ───
  async updateService(userId: string, itemId: string, dto: UpdateServiceItemDto) {
    const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
    if (!provider) throw new NotFoundException('Provider profile not found.');

    const item = await this.prisma.serviceItem.findUnique({ where: { id: itemId } });
    if (!item || item.serviceProviderId !== provider.id) throw new ForbiddenException('Not allowed');

    return this.prisma.serviceItem.update({
      where: { id: itemId },
      data: { ...dto, status: ApprovalStatus.PENDING },
    });
  }

  // ─── Auth: delete service item ───
  async deleteService(userId: string, itemId: string) {
    const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
    if (!provider) throw new NotFoundException('Provider profile not found.');

    const item = await this.prisma.serviceItem.findUnique({ where: { id: itemId } });
    if (!item || item.serviceProviderId !== provider.id) throw new ForbiddenException('Not allowed');

    return this.prisma.serviceItem.delete({ where: { id: itemId } });
  }

  // ─── Auth: get my bookings (provider) ───
  async getMyBookings(userId: string) {
    const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
    if (!provider) throw new NotFoundException('Provider profile not found.');

    return this.prisma.booking.findMany({
      where: { serviceItem: { serviceProviderId: provider.id } },
      include: { serviceItem: { select: { nameEn: true, nameAr: true, price: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Auth: update booking status (provider confirms/cancels) ───
  async updateBookingStatus(userId: string, bookingId: string, status: string) {
    const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
    if (!provider) throw new NotFoundException('Provider profile not found.');

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { serviceItem: true },
    });
    if (!booking || booking.serviceItem.serviceProviderId !== provider.id)
      throw new ForbiddenException('Not allowed');

    return this.prisma.booking.update({ where: { id: bookingId }, data: { status: status as any } });
  }

  // ─── Auth: get my service requests (provider - customs clearer) ───
  async getMyRequests(userId: string) {
    const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
    if (!provider) throw new NotFoundException('Provider profile not found.');

    return this.prisma.serviceRequest.findMany({
      where: { serviceProviderId: provider.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Auth: update service request status (provider) ───
  async updateRequestStatus(userId: string, requestId: string, status: string) {
    const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
    if (!provider) throw new NotFoundException('Provider profile not found.');

    const req = await this.prisma.serviceRequest.findUnique({ where: { id: requestId } });
    if (!req || req.serviceProviderId !== provider.id) throw new ForbiddenException('Not allowed');

    return this.prisma.serviceRequest.update({ where: { id: requestId }, data: { status: status as any } });
  }

  // ─── Public: create booking ───
  async createBooking(providerId: string, dto: CreateBookingDto, customerId?: string) {
    // Verify service item belongs to provider and is approved
    const item = await this.prisma.serviceItem.findUnique({ where: { id: dto.serviceItemId } });
    if (!item || item.serviceProviderId !== providerId)
      throw new BadRequestException('Invalid service item');
    if (item.status !== ApprovalStatus.APPROVED)
      throw new BadRequestException('Service is not available');

    return this.prisma.booking.create({
      data: {
        serviceItemId: dto.serviceItemId,
        customerId: customerId || undefined,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        date: dto.date,
        time: dto.time,
        notes: dto.notes,
      },
    });
  }

  // ─── Public: create service request (customs clearer) ───
  async createServiceRequest(providerId: string, dto: CreateServiceRequestDto, customerId?: string) {
    const provider = await this.prisma.serviceProvider.findUnique({ where: { id: providerId } });
    if (!provider || !provider.isApproved) throw new NotFoundException('Provider not found');

    return this.prisma.serviceRequest.create({
      data: {
        serviceProviderId: providerId,
        customerId: customerId || undefined,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        requestType: dto.requestType,
        notes: dto.notes,
      },
    });
  }

  // ─── Admin: list all (with filters) ───
  async findAllAdmin(type?: ServiceProviderType, approved?: string) {
    const isApproved =
      approved === 'true' ? true : approved === 'false' ? false : undefined;

    return this.prisma.serviceProvider.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(isApproved !== undefined ? { isApproved } : {}),
      },
      include: {
        services: true,
        user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Admin: approve / reject provider ───
  async approve(id: string, approved: boolean) {
    const provider = await this.prisma.serviceProvider.findUnique({ where: { id } });
    if (!provider) throw new NotFoundException('Provider not found');

    return this.prisma.serviceProvider.update({
      where: { id },
      data: { isApproved: approved },
    });
  }

  // ─── Admin: list pending service items ───
  async getPendingServices() {
    return this.prisma.serviceItem.findMany({
      where: { status: ApprovalStatus.PENDING },
      include: {
        serviceProvider: {
          select: { id: true, name: true, nameAr: true, type: true, city: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ─── Admin: approve / reject service item ───
  async approveServiceItem(itemId: string, approved: boolean) {
    const item = await this.prisma.serviceItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Service item not found');

    return this.prisma.serviceItem.update({
      where: { id: itemId },
      data: { status: approved ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED },
    });
  }

  // ─── Admin: delete ───
  async remove(id: string) {
    const provider = await this.prisma.serviceProvider.findUnique({ where: { id } });
    if (!provider) throw new NotFoundException('Provider not found');
    return this.prisma.serviceProvider.delete({ where: { id } });
  }
}
