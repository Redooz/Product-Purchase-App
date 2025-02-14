import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { TransactionHandler } from '@/transaction/application/handler/transaction.handler';
import { Request } from 'express';
import { StartTransactionRequest } from '@/transaction/application/dto/request/start.transaction.request';
import { StartTransactionResponse } from '@/transaction/application/dto/response/start.transaction.response';
import { JwtAuthGuard } from '@/auth/infrastructure/external/guard/jwt.guard';
import { TransactionExceptionHandler } from '@/transaction/infrastructure/input/exceptionhandler/transaction.exception.handler';
import { GetTransactionResponse } from '@/transaction/application/dto/response/get.transaction.response';
import { FinishTransactionRequest } from '@/transaction/application/dto/request/finish.transaction.request';
import { FinishTransactionResponse } from '@/transaction/application/dto/response/finish.transaction.response';

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
  @ApiBody({ type: StartTransactionRequest })
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

  @Post('/finish')
  @ApiOperation({ summary: 'Finish a transaction' })
  @ApiBody({ type: FinishTransactionRequest })
  @ApiResponse({
    status: 201,
    description: 'Transaction finished successfully',
    type: FinishTransactionResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async finishTransaction(
    @Body() finishTransactionDto: FinishTransactionRequest,
  ) {
    try {
      return await this.transactionHandler.finishTransaction(
        finishTransactionDto,
      );
    } catch (error) {
      this.exceptionHandler.handleFinishTransaction(error);
    }
  }

  @Get('/pending')
  @ApiOperation({ summary: 'Get all pending transactions' })
  @ApiResponse({
    status: 200,
    description: 'All pending transactions',
    type: [GetTransactionResponse],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllPendingTransactions(@Req() req: Request) {
    try {
      return await this.transactionHandler.getAllPendingOrderTransactions(req);
    } catch (error) {
      this.exceptionHandler.handleGetAllPendingTransactions(error);
    }
  }

  @Delete('/:transactionId')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiParam({ name: 'transactionId', required: true })
  @ApiResponse({ status: 204, description: 'Transaction deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @HttpCode(204)
  async deleteTransaction(
    @Param('transactionId') transactionId: number,
    @Req() req: Request,
  ) {
    try {
      await this.transactionHandler.deleteTransaction(transactionId, req);
    } catch (error) {
      this.exceptionHandler.handleDeleteTransaction(error);
    }
  }

  @Get('/:transactionId')
  @ApiOperation({ summary: 'Get transaction details by ID' })
  @ApiParam({ name: 'transactionId', required: true })
  @ApiResponse({
    status: 200,
    description: 'Transaction details',
    type: FinishTransactionResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async getTransactionById(
    @Param('transactionId') transactionId: number,
    @Req() req: Request,
  ) {
    try {
      return await this.transactionHandler.getTransactionDetails(
        transactionId,
        req,
      );
    } catch (error) {
      this.exceptionHandler.handleGetTransactionById(error);
    }
  }
}
