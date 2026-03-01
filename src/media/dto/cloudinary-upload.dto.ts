import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum ImagePosition {
  FRONT = 'front',
  BACK = 'back',
  SIDE = 'side',
  OTHER = 'other',
}

export class CloudinaryUploadDto {
  @IsString()
  @IsNotEmpty()
  listingId: string;

  @IsEnum(ImagePosition)
  @IsOptional()
  position?: ImagePosition;
}

export class CloudinarySignatureDto {
  @IsString()
  @IsOptional()
  folder?: string;
}
