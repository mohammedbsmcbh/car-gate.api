export declare class SearchListingsDto {
    q?: string;
    type?: string;
    make?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    city?: string;
    condition?: string;
    transmission?: string;
    fuelType?: string;
    bodyType?: string;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
}
export declare class SearchQueryDto {
    q?: string;
    page?: number;
    limit?: number;
}
export declare class NearbySearchDto {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    page?: number;
    limit?: number;
}
