import { IsString, IsOptional } from 'class-validator';

export class UpsertSettingDto {
  @IsString()
  value: string;

  @IsString()
  @IsOptional()
  description?: string;
}
