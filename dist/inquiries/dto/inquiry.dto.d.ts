export declare class CreateInquiryDto {
    listingId: string;
    message: string;
}
export declare class CreateComplaintDto {
    targetId?: string;
    subject: string;
    description: string;
}
export declare class UpdateComplaintDto {
    status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    resolution?: string;
}
