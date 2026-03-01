import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateSubAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
