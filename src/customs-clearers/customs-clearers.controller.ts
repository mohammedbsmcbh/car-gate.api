import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CustomsClearersService } from './customs-clearers.service';
import { CreateCustomsClearerDto } from './dto/create-customs-clearer.dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('customs-clearers')
export class CustomsClearersController {
  constructor(private readonly customsClearersService: CustomsClearersService) {}

  @Public()
  @Get()
  findAllPublic() {
    return this.customsClearersService.findAllPublic();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCustomsClearerDto,
  ) {
    return this.customsClearersService.create(userId, dto);
  }
}
