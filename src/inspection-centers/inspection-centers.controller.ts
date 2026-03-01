import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InspectionCentersService } from './inspection-centers.service';
import { CreateInspectionCenterDto } from './dto/create-inspection-center.dto';
import { UpdateInspectionCenterDto } from './dto/update-inspection-center.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('inspection-centers')
export class InspectionCentersController {
  constructor(private readonly inspectionCentersService: InspectionCentersService) {}

  @Public()
  @Get()
  findAll() {
    return this.inspectionCentersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('admin')
  findAllAdmin() {
    return this.inspectionCentersService.findAllAdmin();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inspectionCentersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  create(@Body() createInspectionCenterDto: CreateInspectionCenterDto) {
    return this.inspectionCentersService.create(createInspectionCenterDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInspectionCenterDto: UpdateInspectionCenterDto,
  ) {
    return this.inspectionCentersService.update(id, updateInspectionCenterDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inspectionCentersService.remove(id);
  }
}
// Force update
