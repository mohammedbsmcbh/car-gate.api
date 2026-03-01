import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ComplaintStatus } from '@prisma/client';

export class CreateComplaintDto {
    @IsString()
    @IsOptional()
    targetId?: string;

    @IsString()
    subject: string;

    @IsString()
    description: string;
}

export class UpdateComplaintDto {
    @IsEnum(ComplaintStatus)
    @IsOptional()
    status?: ComplaintStatus;

    @IsString()
    @IsOptional()
    resolution?: string;
}
