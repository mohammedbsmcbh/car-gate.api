export declare enum ImagePosition {
    FRONT = "front",
    BACK = "back",
    SIDE = "side",
    OTHER = "other"
}
export declare class CloudinaryUploadDto {
    listingId: string;
    position?: ImagePosition;
}
export declare class CloudinarySignatureDto {
    folder?: string;
}
