import { IsString, IsNotEmpty, IsNumber, IsPositive, IsDateString, IsOptional, Min } from 'class-validator';

export class CreateFeaturedListingDto {
  @IsString()
  @IsNotEmpty()
  listingId: string;

  @IsNumber()
  @IsPositive()
  days: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsDateString()
  @IsOptional()
  startsAt?: string;

  @IsNumber()
  @IsOptional()
  priority?: number;
}
