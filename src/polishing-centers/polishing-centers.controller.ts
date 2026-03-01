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
import { PolishingCentersService } from './polishing-centers.service';
import { CreatePolishingCenterDto } from './dto/create-polishing-center.dto';
import { UpdatePolishingCenterDto } from './dto/update-polishing-center.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('polishing-centers')
export class PolishingCentersController {
  constructor(private readonly polishingCentersService: PolishingCentersService) {}

  @Public()
  @Get()
  findAll() {
    return this.polishingCentersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('admin')
  findAllAdmin() {
    return this.polishingCentersService.findAllAdmin();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.polishingCentersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  create(@Body() createPolishingCenterDto: CreatePolishingCenterDto) {
    return this.polishingCentersService.create(createPolishingCenterDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePolishingCenterDto: UpdatePolishingCenterDto,
  ) {
    return this.polishingCentersService.update(id, updatePolishingCenterDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.polishingCentersService.remove(id);
  }
}
