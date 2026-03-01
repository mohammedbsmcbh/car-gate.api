"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProvidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ServiceProvidersService = class ServiceProvidersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(type, city) {
        return this.prisma.serviceProvider.findMany({
            where: {
                type,
                isApproved: true,
                ...(city ? { city: { contains: city, mode: 'insensitive' } } : {}),
            },
            include: {
                services: {
                    where: { isActive: true, status: client_1.ApprovalStatus.APPROVED },
                    orderBy: { price: 'asc' },
                },
                user: { select: { name: true, phone: true, whatsapp: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const provider = await this.prisma.serviceProvider.findUnique({
            where: { id },
            include: {
                services: {
                    where: { isActive: true, status: client_1.ApprovalStatus.APPROVED },
                    orderBy: { price: 'asc' },
                },
                user: { select: { name: true, phone: true, whatsapp: true, email: true } },
            },
        });
        if (!provider || !provider.isApproved)
            throw new common_1.NotFoundException('Provider not found');
        return provider;
    }
    async findMyProfile(userId) {
        return this.prisma.serviceProvider.findUnique({
            where: { userId },
            include: {
                services: { orderBy: { createdAt: 'asc' } },
            },
        });
    }
    async upsertProfile(userId, dto) {
        const existing = await this.prisma.serviceProvider.findUnique({ where: { userId } });
        if (existing) {
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
    async updateProfile(userId, dto) {
        const existing = await this.prisma.serviceProvider.findUnique({ where: { userId } });
        if (!existing)
            throw new common_1.NotFoundException('Profile not found. Please create your profile first.');
        return this.prisma.serviceProvider.update({
            where: { userId },
            data: dto,
            include: { services: true },
        });
    }
    async addService(userId, dto) {
        const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
        if (!provider)
            throw new common_1.NotFoundException('Please create your provider profile first.');
        return this.prisma.serviceItem.create({
            data: {
                serviceProviderId: provider.id,
                nameEn: dto.nameEn,
                nameAr: dto.nameAr,
                description: dto.description,
                price: dto.price,
                duration: dto.duration,
                status: client_1.ApprovalStatus.PENDING,
            },
        });
    }
    async updateService(userId, itemId, dto) {
        const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
        if (!provider)
            throw new common_1.NotFoundException('Provider profile not found.');
        const item = await this.prisma.serviceItem.findUnique({ where: { id: itemId } });
        if (!item || item.serviceProviderId !== provider.id)
            throw new common_1.ForbiddenException('Not allowed');
        return this.prisma.serviceItem.update({
            where: { id: itemId },
            data: { ...dto, status: client_1.ApprovalStatus.PENDING },
        });
    }
    async deleteService(userId, itemId) {
        const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
        if (!provider)
            throw new common_1.NotFoundException('Provider profile not found.');
        const item = await this.prisma.serviceItem.findUnique({ where: { id: itemId } });
        if (!item || item.serviceProviderId !== provider.id)
            throw new common_1.ForbiddenException('Not allowed');
        return this.prisma.serviceItem.delete({ where: { id: itemId } });
    }
    async getMyBookings(userId) {
        const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
        if (!provider)
            throw new common_1.NotFoundException('Provider profile not found.');
        return this.prisma.booking.findMany({
            where: { serviceItem: { serviceProviderId: provider.id } },
            include: { serviceItem: { select: { nameEn: true, nameAr: true, price: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateBookingStatus(userId, bookingId, status) {
        const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
        if (!provider)
            throw new common_1.NotFoundException('Provider profile not found.');
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { serviceItem: true },
        });
        if (!booking || booking.serviceItem.serviceProviderId !== provider.id)
            throw new common_1.ForbiddenException('Not allowed');
        return this.prisma.booking.update({ where: { id: bookingId }, data: { status: status } });
    }
    async getMyRequests(userId) {
        const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
        if (!provider)
            throw new common_1.NotFoundException('Provider profile not found.');
        return this.prisma.serviceRequest.findMany({
            where: { serviceProviderId: provider.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateRequestStatus(userId, requestId, status) {
        const provider = await this.prisma.serviceProvider.findUnique({ where: { userId } });
        if (!provider)
            throw new common_1.NotFoundException('Provider profile not found.');
        const req = await this.prisma.serviceRequest.findUnique({ where: { id: requestId } });
        if (!req || req.serviceProviderId !== provider.id)
            throw new common_1.ForbiddenException('Not allowed');
        return this.prisma.serviceRequest.update({ where: { id: requestId }, data: { status: status } });
    }
    async createBooking(providerId, dto, customerId) {
        const item = await this.prisma.serviceItem.findUnique({ where: { id: dto.serviceItemId } });
        if (!item || item.serviceProviderId !== providerId)
            throw new common_1.BadRequestException('Invalid service item');
        if (item.status !== client_1.ApprovalStatus.APPROVED)
            throw new common_1.BadRequestException('Service is not available');
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
    async createServiceRequest(providerId, dto, customerId) {
        const provider = await this.prisma.serviceProvider.findUnique({ where: { id: providerId } });
        if (!provider || !provider.isApproved)
            throw new common_1.NotFoundException('Provider not found');
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
    async findAllAdmin(type, approved) {
        const isApproved = approved === 'true' ? true : approved === 'false' ? false : undefined;
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
    async approve(id, approved) {
        const provider = await this.prisma.serviceProvider.findUnique({ where: { id } });
        if (!provider)
            throw new common_1.NotFoundException('Provider not found');
        return this.prisma.serviceProvider.update({
            where: { id },
            data: { isApproved: approved },
        });
    }
    async getPendingServices() {
        return this.prisma.serviceItem.findMany({
            where: { status: client_1.ApprovalStatus.PENDING },
            include: {
                serviceProvider: {
                    select: { id: true, name: true, nameAr: true, type: true, city: true },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async approveServiceItem(itemId, approved) {
        const item = await this.prisma.serviceItem.findUnique({ where: { id: itemId } });
        if (!item)
            throw new common_1.NotFoundException('Service item not found');
        return this.prisma.serviceItem.update({
            where: { id: itemId },
            data: { status: approved ? client_1.ApprovalStatus.APPROVED : client_1.ApprovalStatus.REJECTED },
        });
    }
    async remove(id) {
        const provider = await this.prisma.serviceProvider.findUnique({ where: { id } });
        if (!provider)
            throw new common_1.NotFoundException('Provider not found');
        return this.prisma.serviceProvider.delete({ where: { id } });
    }
};
exports.ServiceProvidersService = ServiceProvidersService;
exports.ServiceProvidersService = ServiceProvidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiceProvidersService);
//# sourceMappingURL=service-providers.service.js.map