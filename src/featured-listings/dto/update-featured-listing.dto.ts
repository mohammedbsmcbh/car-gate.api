import { IsBoolean, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class UpdateFeaturedListingDto {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsNumber()
  @IsOptional()
  priority?: number;
}
