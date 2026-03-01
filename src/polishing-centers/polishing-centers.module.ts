import { Module } from '@nestjs/common';
import { PolishingCentersService } from './polishing-centers.service';
import { PolishingCentersController } from './polishing-centers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PolishingCentersController],
  providers: [PolishingCentersService],
})
export class PolishingCentersModule {}
