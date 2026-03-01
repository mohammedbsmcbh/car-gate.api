import { ServiceProviderType } from '@prisma/client';
export declare class CreateServiceProviderDto {
    type: ServiceProviderType;
    name?: string;
    nameAr?: string;
    description?: string;
    city?: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    logo?: string;
    latitude?: number;
    longitude?: number;
}
export declare class UpdateServiceProviderDto {
    name?: string;
    nameAr?: string;
    description?: string;
    city?: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    logo?: string;
    latitude?: number;
    longitude?: number;
}
export declare class CreateServiceItemDto {
    nameEn: string;
    nameAr?: string;
    description?: string;
    price: number;
    duration?: string;
}
export declare class UpdateServiceItemDto {
    nameEn?: string;
    nameAr?: string;
    description?: string;
    price?: number;
    duration?: string;
    isActive?: boolean;
}
export declare class CreateBookingDto {
    serviceItemId: string;
    customerName: string;
    customerPhone: string;
    date: string;
    time?: string;
    notes?: string;
}
export declare class CreateServiceRequestDto {
    customerName: string;
    customerPhone: string;
    requestType: string;
    notes?: string;
}
