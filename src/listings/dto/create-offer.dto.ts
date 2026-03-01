import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOfferDto {
    @IsNumber()
    @Min(1)
    amount: number;

    @IsOptional()
    @IsString()
    message?: string;
}
