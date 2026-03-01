import { Module } from '@nestjs/common';
import { InspectionCentersService } from './inspection-centers.service';
import { InspectionCentersController } from './inspection-centers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InspectionCentersController],
  providers: [InspectionCentersService],
})
export class InspectionCentersModule {}
