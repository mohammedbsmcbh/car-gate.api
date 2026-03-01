import { PartialType } from '@nestjs/mapped-types';
import { CreatePolishingCenterDto } from './create-polishing-center.dto';

export class UpdatePolishingCenterDto extends PartialType(CreatePolishingCenterDto) {}
