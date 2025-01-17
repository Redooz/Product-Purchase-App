import { Injectable } from '@nestjs/common';
import { TransactionServicePort } from '@/transaction/domain/api/transaction.service.port';
import { StartTransactionResponse } from '@/transaction/application/dto/response/start.transaction.response';
import { StartTransactionRequest } from '@/transaction/application/dto/request/start.transaction.request';
import { Request } from 'express';
import { OrderTransaction } from '@/transaction/domain/model/order.transaction';
import { Customer } from '@/customer/domain/model/customer';
import { PayloadToken } from '@/auth/domain/model/token.model';
import { GetTransactionResponse } from '@/transaction/application/dto/response/get.transaction.response';
import { FinishTransactionRequest } from '@/transaction/application/dto/request/finish.transaction.request';
import { FinishTransactionResponse } from '@/transaction/application/dto/response/finish.transaction.response';

@Injectable()
export class TransactionHandler {
  constructor(
    private readonly transactionServicePort: TransactionServicePort,
  ) {}

  async startTransaction(
    request: Request,
    startTransactionRequestDto: StartTransactionRequest,
  ): Promise<StartTransactionResponse> {
    const { sub } = request.user as PayloadToken;
    const loggedCustomer: Customer = { id: sub };

    const startTransactionModel: OrderTransaction = {
      quantity: startTransactionRequestDto.quantity,
      product: {
        id: startTransactionRequestDto.productId,
      },
      customer: {
        id: loggedCustomer.id,
      },
      delivery: {
        phoneNumber: startTransactionRequestDto.deliveryInfo.phoneNumber,
        personName: startTransactionRequestDto.deliveryInfo.personName,
        address: startTransactionRequestDto.deliveryInfo.address,
        country: startTransactionRequestDto.deliveryInfo.country,
        city: startTransactionRequestDto.deliveryInfo.city,
        region: startTransactionRequestDto.deliveryInfo.region,
        postalCode: startTransactionRequestDto.deliveryInfo.postalCode,
      },
    };

    const response = await this.transactionServicePort.startTransaction(
      startTransactionModel,
    );

    const acceptanceEndUserPolicy =
      response.transaction.acceptanceEndUserPolicy;
    const acceptancePersonalDataAuthorization =
      response.transaction.acceptancePersonalDataAuthorization;

    return {
      id: response.transaction.id,
      total: response.transaction.total,
      status: response.transaction.status.name,
      deliveryFee: response.delivery.fee,
      endUserPolicy: {
        acceptanceToken: acceptanceEndUserPolicy.acceptanceToken,
        type: acceptanceEndUserPolicy.type,
        permalink: acceptanceEndUserPolicy.permalink,
      },
      personalDataAuthorization: {
        acceptanceToken: acceptancePersonalDataAuthorization.acceptanceToken,
        type: acceptancePersonalDataAuthorization.type,
        permalink: acceptancePersonalDataAuthorization.permalink,
      },
    };
  }

  async finishTransaction({
    transactionId,
    card,
  }: FinishTransactionRequest): Promise<FinishTransactionResponse> {
    const transaction =
      await this.transactionServicePort.finishTransactionWithCard(
        transactionId,
        card,
      );

    return {
      id: transaction.id,
      total: transaction.total,
      status: transaction.status.name,
      deliveryFee: transaction.delivery.fee,
      product: {
        name: transaction.product.name,
        quantity: transaction.quantity,
      },
    };
  }

  async getTransactionDetails(
    transactionId: number,
    request: Request,
  ): Promise<FinishTransactionResponse> {
    const { sub } = request.user as PayloadToken;
    const transaction =
      await this.transactionServicePort.getTransactionDetailsById(
        transactionId,
        sub,
      );

    return {
      id: transaction.id,
      total: transaction.total,
      status: transaction.status.name,
      deliveryFee: transaction.delivery.fee,
      product: {
        name: transaction.product.name,
        quantity: transaction.quantity,
      },
    };
  }

  async deleteTransaction(
    transactionId: number,
    request: Request,
  ): Promise<void> {
    const { sub } = request.user as PayloadToken;
    await this.transactionServicePort.deleteOrderTransaction(
      transactionId,
      sub,
    );
  }

  async getAllPendingOrderTransactions(
    request: Request,
  ): Promise<GetTransactionResponse[]> {
    const { sub } = request.user as PayloadToken;
    const response =
      await this.transactionServicePort.getAllPendingOrderTransactionsByCustomerId(
        sub,
      );

    return response.map(
      (transaction): GetTransactionResponse => ({
        id: transaction.id,
        total: transaction.total.toString(),
        quantity: transaction.quantity,
        status: {
          id: transaction.status.id,
          name: transaction.status.name,
        },
        delivery: {
          id: transaction.delivery.id,
          personName: transaction.delivery.personName,
          address: transaction.delivery.address,
          country: transaction.delivery.country,
          city: transaction.delivery.city,
          postalCode: transaction.delivery.postalCode,
        },
        product: {
          id: transaction.product.id,
          name: transaction.product.name,
          price: transaction.product.price.toString(),
        },
      }),
    );
  }
}
