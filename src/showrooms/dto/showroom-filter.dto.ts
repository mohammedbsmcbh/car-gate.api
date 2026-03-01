import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ShowroomFilterDto {
  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isApproved?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isVerified?: boolean;
}
