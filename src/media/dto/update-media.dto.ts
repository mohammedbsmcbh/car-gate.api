import { IsBoolean, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateMediaDto {
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsInt()
  @IsOptional()
  @Min(0)
  order?: number;
}
