import { CreateInspectionCenterDto } from './create-inspection-center.dto';
declare const UpdateInspectionCenterDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateInspectionCenterDto>>;
export declare class UpdateInspectionCenterDto extends UpdateInspectionCenterDto_base {
    isActive?: boolean;
}
export {};
