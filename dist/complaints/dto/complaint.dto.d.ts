import { ComplaintStatus } from '@prisma/client';
export declare class CreateComplaintDto {
    targetId?: string;
    subject: string;
    description: string;
}
export declare class UpdateComplaintDto {
    status?: ComplaintStatus;
    resolution?: string;
}
