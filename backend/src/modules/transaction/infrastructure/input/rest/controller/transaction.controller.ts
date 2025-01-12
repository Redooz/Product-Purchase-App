import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionHandler } from '@/transaction/application/handler/transaction.handler';
import { Request } from 'express';
import { StartTransactionRequest } from '@/transaction/application/dto/request/start.transaction.request';
import { StartTransactionResponse } from '@/transaction/application/dto/response/start.transaction.response';
import { JwtAuthGuard } from '@/auth/infrastructure/external/guard/jwt.guard';
import { TransactionExceptionHandler } from '@/transaction/infrastructure/input/exceptionhandler/transaction.exception.handler';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    private readonly transactionHandler: TransactionHandler,
    private readonly exceptionHandler: TransactionExceptionHandler,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Start a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction started successfully',
    type: StartTransactionResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Customer or Product not found' })
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
