import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCustomsClearerDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @MinLength(3)
  phone!: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;

  // Optional base64 or data URL. If provided, backend uploads to Cloudinary.
  @IsOptional()
  @IsString()
  image?: string;
}
