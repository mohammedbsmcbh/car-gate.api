export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video"
}
export declare class UploadMediaDto {
    listingId: string;
    url: string;
    type: MediaType;
    isPrimary?: boolean;
    order?: number;
}
