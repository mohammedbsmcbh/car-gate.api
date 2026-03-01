import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreatePaymentDto {
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsUUID()
  @IsOptional()
  listingId?: string;

  @IsUUID()
  @IsOptional()
  featuredPricingId?: string;

  @IsUUID()
  @IsOptional()
  packageId?: string;
}
