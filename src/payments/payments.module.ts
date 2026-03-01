import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MockPaymentAdapter } from './adapters/mock-payment.adapter';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, MockPaymentAdapter],
  exports: [PaymentsService],
})
export class PaymentsModule {}
