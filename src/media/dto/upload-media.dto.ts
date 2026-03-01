import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsInt, Min, IsEnum } from 'class-validator';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export class UploadMediaDto {
  @IsString()
  @IsNotEmpty()
  listingId: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsEnum(MediaType)
  type: MediaType;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsInt()
  @IsOptional()
  @Min(0)
  order?: number;
}
