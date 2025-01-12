import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionHandler } from '@/transaction/application/handler/transaction.handler';
import { Request } from 'express';
import { StartTransactionRequest } from '@/transaction/application/dto/request/start.transaction.request';
import { JwtAuthGuard } from '@/auth/infrastructure/external/guard/jwt.guard';
import { TransactionExceptionHandler } from '@/transaction/infrastructure/input/exceptionhandler/transaction.exception.handler';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    private readonly transactionHandler: TransactionHandler,
    private readonly exceptionHandler: TransactionExceptionHandler,
  ) {}

  @Post()
  async startTransaction(
    @Req() req: Request,
    @Body() startTransactionDto: StartTransactionRequest,
  ) {
    try {
      return await this.transactionHandler.startTransaction(
        req,
        startTransactionDto,
      );
    } catch (error) {
      this.exceptionHandler.handleStartTransaction(error);
    }
  }
}
