import { PartialType } from '@nestjs/mapped-types';
import { CreateInspectionCenterDto } from './create-inspection-center.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateInspectionCenterDto extends PartialType(CreateInspectionCenterDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
