import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferStatusDto } from './dto/update-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(userId, createOfferDto);
  }

  @Get('sent')
  findAllSent(@CurrentUser('id') userId: string) {
    return this.offersService.findAllByUser(userId);
  }

  @Get('received')
  findAllReceived(@CurrentUser('id') userId: string) {
    return this.offersService.findAllReceived(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateOfferStatusDto: UpdateOfferStatusDto,
  ) {
    return this.offersService.updateStatus(id, userId, updateOfferStatusDto);
  }
}
