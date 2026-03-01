"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectionCentersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InspectionCentersService = class InspectionCentersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createInspectionCenterDto) {
        return this.prisma.inspectionCenter.create({
            data: createInspectionCenterDto,
        });
    }
    findAll() {
        return this.prisma.inspectionCenter.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    findAllAdmin() {
        return this.prisma.inspectionCenter.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const center = await this.prisma.inspectionCenter.findUnique({
            where: { id },
        });
        if (!center) {
            throw new common_1.NotFoundException('Inspection center not found');
        }
        return center;
    }
    async update(id, updateInspectionCenterDto) {
        await this.findOne(id);
        return this.prisma.inspectionCenter.update({
            where: { id },
            data: updateInspectionCenterDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.inspectionCenter.delete({
            where: { id },
        });
    }
};
exports.InspectionCentersService = InspectionCentersService;
exports.InspectionCentersService = InspectionCentersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InspectionCentersService);
//# sourceMappingURL=inspection-centers.service.js.map