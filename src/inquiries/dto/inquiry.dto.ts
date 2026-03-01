import { IsString, IsOptional } from 'class-validator';

export class CreateInquiryDto {
    @IsString()
    listingId: string;

    @IsString()
    message: string;
}

export class CreateComplaintDto {
    @IsString()
    @IsOptional()
    targetId?: string; // User being complained about

    @IsString()
    subject: string;

    @IsString()
    description: string;
}

export class UpdateComplaintDto {
    @IsString()
    @IsOptional()
    status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

    @IsString()
    @IsOptional()
    resolution?: string;
}
