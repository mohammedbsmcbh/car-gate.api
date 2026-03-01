import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateStoryDto {
  @IsString()
  mediaUrl: string;

  @IsString()
  @IsEnum(['IMAGE', 'VIDEO'])
  mediaType: string;

  @IsString()
  @IsOptional()
  caption?: string;
}
