import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApprovalStatus } from '@prisma/client';

export class UpdateListingStatusDto {
    @IsEnum(ApprovalStatus)
    @IsNotEmpty()
    status: ApprovalStatus;
}
