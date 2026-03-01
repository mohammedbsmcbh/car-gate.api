import { Module } from '@nestjs/common';
import { CustomsClearersController } from './customs-clearers.controller';
import { CustomsClearersService } from './customs-clearers.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CustomsClearersController],
  providers: [CustomsClearersService],
})
export class CustomsClearersModule {}
