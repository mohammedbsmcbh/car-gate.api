"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShowroomDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_showroom_dto_1 = require("./create-showroom.dto");
class UpdateShowroomDto extends (0, mapped_types_1.PartialType)(create_showroom_dto_1.CreateShowroomDto) {
}
exports.UpdateShowroomDto = UpdateShowroomDto;
//# sourceMappingURL=update-showroom.dto.js.map