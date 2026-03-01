import { ServiceProvidersService } from './service-providers.service';
import { CreateServiceProviderDto, UpdateServiceProviderDto, CreateServiceItemDto, UpdateServiceItemDto, CreateBookingDto, CreateServiceRequestDto } from './dto/service-provider.dto';
import { ServiceProviderType } from '@prisma/client';
export declare class ServiceProvidersController {
    private readonly service;
    constructor(service: ServiceProvidersService);
    findAll(type: ServiceProviderType, city?: string): Promise<({
        user: {
            email: string;
            name: string | null;
            phone: string | null;
            whatsapp: string | null;
        };
        services: {
            id: string;
            status: import("@prisma/client").$Enums.ApprovalStatus;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameAr: string | null;
            description: string | null;
            duration: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            nameEn: string;
            serviceProviderId: string;
        }[];
    } & {
        name: string | null;
        phone: string | null;
        whatsapp: string | null;
        id: string;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ServiceProviderType;
        nameAr: string | null;
        description: string | null;
        city: string | null;
        address: string | null;
        logo: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            email: string;
            name: string | null;
            phone: string | null;
            whatsapp: string | null;
        };
        services: {
            id: string;
            status: import("@prisma/client").$Enums.ApprovalStatus;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameAr: string | null;
            description: string | null;
            duration: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            nameEn: string;
            serviceProviderId: string;
        }[];
    } & {
        name: string | null;
        phone: string | null;
        whatsapp: string | null;
        id: string;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ServiceProviderType;
        nameAr: string | null;
        description: string | null;
        city: string | null;
        address: string | null;
        logo: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
    }>;
    createBooking(providerId: string, dto: CreateBookingDto): Promise<{
        date: string;
        id: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        time: string | null;
        serviceItemId: string;
        customerName: string;
        customerPhone: string;
        customerId: string | null;
    }>;
    createServiceRequest(providerId: string, dto: CreateServiceRequestDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ServiceRequestStatus;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        customerName: string;
        customerPhone: string;
        requestType: string;
        serviceProviderId: string;
        customerId: string | null;
    }>;
    getMyProfile(userId: string): Promise<({
        services: {
            id: string;
            status: import("@prisma/client").$Enums.ApprovalStatus;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameAr: string | null;
            description: string | null;
            duration: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            nameEn: string;
            serviceProviderId: string;
        }[];
    } & {
        name: string | null;
        phone: string | null;
        whatsapp: string | null;
        id: string;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ServiceProviderType;
        nameAr: string | null;
        description: string | null;
        city: string | null;
        address: string | null;
        logo: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
    }) | null>;
    upsertProfile(userId: string, dto: CreateServiceProviderDto): Promise<{
        services: {
            id: string;
            status: import("@prisma/client").$Enums.ApprovalStatus;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameAr: string | null;
            description: string | null;
            duration: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            nameEn: string;
            serviceProviderId: string;
        }[];
    } & {
        name: string | null;
        phone: string | null;
        whatsapp: string | null;
        id: string;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ServiceProviderType;
        nameAr: string | null;
        description: string | null;
        city: string | null;
        address: string | null;
        logo: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
    }>;
    updateProfile(userId: string, dto: UpdateServiceProviderDto): Promise<{
        services: {
            id: string;
            status: import("@prisma/client").$Enums.ApprovalStatus;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameAr: string | null;
            description: string | null;
            duration: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            nameEn: string;
            serviceProviderId: string;
        }[];
    } & {
        name: string | null;
        phone: string | null;
        whatsapp: string | null;
        id: string;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ServiceProviderType;
        nameAr: string | null;
        description: string | null;
        city: string | null;
        address: string | null;
        logo: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
    }>;
    addService(userId: string, dto: CreateServiceItemDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        description: string | null;
        duration: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        nameEn: string;
        serviceProviderId: string;
    }>;
    updateService(userId: string, itemId: string, dto: UpdateServiceItemDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        description: string | null;
        duration: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        nameEn: string;
        serviceProviderId: string;
    }>;
    deleteService(userId: string, itemId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        description: string | null;
        duration: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        nameEn: string;
        serviceProviderId: string;
    }>;
    getMyBookings(userId: string): Promise<({
        serviceItem: {
            nameAr: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            nameEn: string;
        };
    } & {
        date: string;
        id: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        time: string | null;
        serviceItemId: string;
        customerName: string;
        customerPhone: string;
        customerId: string | null;
    })[]>;
    updateBookingStatus(userId: string, bookingId: string, body: {
        status: string;
    }): Promise<{
        date: string;
        id: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        time: string | null;
        serviceItemId: string;
        customerName: string;
        customerPhone: string;
        customerId: string | null;
    }>;
    getMyRequests(userId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ServiceRequestStatus;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        customerName: string;
        customerPhone: string;
        requestType: string;
        serviceProviderId: string;
        customerId: string | null;
    }[]>;
    updateRequestStatus(userId: string, requestId: string, body: {
        status: string;
    }): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ServiceRequestStatus;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        customerName: string;
        customerPhone: string;
        requestType: string;
        serviceProviderId: string;
        customerId: string | null;
    }>;
    findAllAdmin(type?: ServiceProviderType, approved?: string): Promise<({
        user: {
            email: string;
            name: string | null;
            phone: string | null;
            id: string;
            createdAt: Date;
        };
        services: {
            id: string;
            status: import("@prisma/client").$Enums.ApprovalStatus;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameAr: string | null;
            description: string | null;
            duration: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            nameEn: string;
            serviceProviderId: string;
        }[];
    } & {
        name: string | null;
        phone: string | null;
        whatsapp: string | null;
        id: string;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ServiceProviderType;
        nameAr: string | null;
        description: string | null;
        city: string | null;
        address: string | null;
        logo: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
    })[]>;
    getPendingServices(): Promise<({
        serviceProvider: {
            name: string | null;
            id: string;
            type: import("@prisma/client").$Enums.ServiceProviderType;
            nameAr: string | null;
            city: string | null;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        description: string | null;
        duration: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        nameEn: string;
        serviceProviderId: string;
    })[]>;
    approveServiceItem(itemId: string, body: {
        approved: boolean;
    }): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        description: string | null;
        duration: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        nameEn: string;
        serviceProviderId: string;
    }>;
    approve(id: string, body: {
        approved: boolean;
    }): Promise<{
        name: string | null;
        phone: string | null;
        whatsapp: string | null;
        id: string;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ServiceProviderType;
        nameAr: string | null;
        description: string | null;
        city: string | null;
        address: string | null;
        logo: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
    }>;
    remove(id: string): Promise<{
        name: string | null;
        phone: string | null;
        whatsapp: string | null;
        id: string;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ServiceProviderType;
        nameAr: string | null;
        description: string | null;
        city: string | null;
        address: string | null;
        logo: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
    }>;
}
