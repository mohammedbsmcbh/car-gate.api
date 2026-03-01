import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment(req.user.id, createPaymentDto);
  }

  @Get('my-transactions')
  findAll(@Request() req) {
    return this.paymentsService.getUserTransactions(req.user.id);
  }

  @Get('plans')
  getPlans() {
    return this.paymentsService.getFeaturedPlans();
  }
}
