import { PaymentGatewayServicePort } from '@/transaction/domain/spi/payment.gateway.service.port';
import { Inject, Injectable } from '@nestjs/common';
import { OrderTransaction } from '@/transaction/domain/model/order.transaction';
import { Card } from '@/transaction/domain/model/card';
import { PaymentGatewayResult } from '@/transaction/domain/model/payment.gateway.result';
import { WompiApiClient } from '@/transaction/infrastructure/external/wompi/api/wompi.api.client';
import { CardTokenizationRequest } from '@/transaction/infrastructure/external/wompi/dto/request/card.tokenization.request';
import configuration from '@/src/app/config/configuration';
import { ConfigType } from '@nestjs/config';
import * as crypto from 'crypto';
import { CreateWompiTransactionRequest } from '@/transaction/infrastructure/external/wompi/dto/request/create.wompi.transaction.request';
import { PaymentStatus } from '@/transaction/domain/model/enum/payment.status';

@Injectable()
export class WompiPaymentGatewayServiceAdapter extends PaymentGatewayServicePort {
  constructor(
    @Inject(configuration.KEY)
    private readonly configService: ConfigType<typeof configuration>,
    private readonly apiClient: WompiApiClient,
  ) {
    super();
  }

  async pay(
    transaction: OrderTransaction,
    card: Card,
  ): Promise<PaymentGatewayResult> {
    const tokenizationRequest: CardTokenizationRequest = {
      cvc: card.cvc,
      card_holder: card.cardHolder,
      exp_month: card.expMonth,
      number: card.number,
      exp_year: card.expYear,
    };

    const tokenizationResult =
      await this.apiClient.tokenizeCard(tokenizationRequest);

    const integrationSecret = this.configService.wompi.integrationKey;

    const totalInCents = transaction.total * 100;

    const unhashedSignature = `redoz-${transaction.id}${totalInCents}COP${integrationSecret}`;

    const hashedSignature = crypto
      .createHash('sha256')
      .update(unhashedSignature)
      .digest('hex');

    const createTransactionRequest: CreateWompiTransactionRequest = {
      acceptance_token: transaction.acceptanceEndUserPolicy.acceptanceToken,
      amount_in_cents: totalInCents,
      currency: 'COP',
      signature: hashedSignature,
      customer_email: transaction.customer.email,
      payment_method: {
        type: 'CARD',
        token: tokenizationResult.data.id,
        installments: 1,
      },
      reference: `redoz-${transaction.id}`,
      customer_data: {
        full_name: transaction.delivery.personName,
      },
      shipping_address: {
        address_line_1: transaction.delivery.address,
        city: transaction.delivery.city,
        country: transaction.delivery.country,
        phone_number: transaction.delivery.phoneNumber,
        postal_code: transaction.delivery.postalCode,
        region: transaction.delivery.region,
      },
    };

    const createTransactionResult = await this.apiClient.createTransaction(
      createTransactionRequest,
    );

    if (createTransactionResult.data.status !== PaymentStatus.PENDING) {
      return {
        id: createTransactionResult.data.id,
        status: createTransactionResult.data.status as PaymentStatus,
      };
    }

    let retries = 5;
    let transactionStatus = PaymentStatus.PENDING;
    while (retries > 0 && transactionStatus === PaymentStatus.PENDING) {
      const transactionStatusResponse = await this.apiClient.getTransaction(
        createTransactionResult.data.id,
      );
      transactionStatus = transactionStatusResponse.data
        .status as PaymentStatus;
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return {
      id: createTransactionResult.data.id,
      status: transactionStatus,
    };
  }
}
