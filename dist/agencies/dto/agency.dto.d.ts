export declare class CreateAgencyDto {
    name: string;
    nameAr?: string;
    description?: string;
    descriptionAr?: string;
    commercialRecord?: string;
    logo?: string;
    coverImage?: string;
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    website?: string;
}
export declare class UpdateAgencyDto extends CreateAgencyDto {
}
export declare class CreateSubAdminDto {
    email: string;
    name: string;
    password: string;
}
export declare class AgencyFilterDto {
    city?: string;
    isApproved?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}
