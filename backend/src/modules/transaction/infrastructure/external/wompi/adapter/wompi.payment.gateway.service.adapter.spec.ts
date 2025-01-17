import { Test, TestingModule } from '@nestjs/testing';
import { WompiPaymentGatewayServiceAdapter } from './wompi.payment.gateway.service.adapter';
import { WompiApiClient } from '@/transaction/infrastructure/external/wompi/api/wompi.api.client';
import configuration from '@/src/app/config/configuration';
import { OrderTransaction } from '@/transaction/domain/model/order.transaction';
import { Card } from '@/transaction/domain/model/card';
import { PaymentStatus } from '@/transaction/domain/model/enum/payment.status';
import { CardTokenizationResponse } from '@/transaction/infrastructure/external/wompi/dto/response/card.tokenization.response';
import { GetWompiTransactionResponse } from '@/transaction/infrastructure/external/wompi/dto/response/get.wompi.transaction.response';

describe('WompiPaymentGatewayServiceAdapter', () => {
  let service: WompiPaymentGatewayServiceAdapter;
  let apiClient: WompiApiClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WompiPaymentGatewayServiceAdapter,
        {
          provide: WompiApiClient,
          useValue: {
            tokenizeCard: jest.fn(),
            createTransaction: jest.fn(),
            getTransaction: jest.fn(),
          },
        },
        {
          provide: configuration.KEY,
          useValue: {
            wompi: {
              integrationKey: 'test_integration_key',
            },
          },
        },
      ],
    }).compile();

    service = module.get<WompiPaymentGatewayServiceAdapter>(
      WompiPaymentGatewayServiceAdapter,
    );
    apiClient = module.get<WompiApiClient>(WompiApiClient);
  });

  it('should pay successfully', async () => {
    const transaction = createMockOrderTransaction();
    const card = createMockCard();
    await setupMockResponses(PaymentStatus.APPROVED);

    const result = await service.pay(transaction, card);

    expect(result).toEqual({
      id: 'transaction_id',
      status: PaymentStatus.APPROVED,
    });
  });

  it('should return pending status if transaction is pending', async () => {
    const transaction = createMockOrderTransaction();
    const card = createMockCard();
    await setupMockResponses(PaymentStatus.PENDING);

    const result = await service.pay(transaction, card);

    expect(result).toEqual({
      id: 'transaction_id',
      status: PaymentStatus.PENDING,
    });
  }, 10000);

  function createMockOrderTransaction(): OrderTransaction {
    return {
      id: 1,
      total: 200,
      customer: { email: 'customer@example.com' },
      acceptanceEndUserPolicy: { acceptanceToken: 'acceptance_token' },
      delivery: {
        personName: 'John Doe',
        address: '123 Main St',
        city: 'City',
        country: 'Country',
        phoneNumber: '1234567890',
        postalCode: '12345',
        region: 'Region',
      },
    } as OrderTransaction;
  }

  function createMockCard(): Card {
    return {
      number: '4242424242424242',
      cvc: '123',
      expMonth: '08',
      expYear: '28',
      cardHolder: 'John Doe',
    };
  }

  function createMockCardTokenizationResponse(): CardTokenizationResponse {
    return {
      data: {
        id: 'card_token',
        created_at: '',
        brand: '',
        name: '',
        last_four: '',
        bin: '',
        exp_year: '',
        exp_month: '',
        card_holder: '',
        created_with_cvc: false,
        expires_at: '',
        validity_ends_at: '',
      },
      status: '',
    };
  }

  function createMockWompiTransactionResponse(
    status: PaymentStatus,
  ): GetWompiTransactionResponse {
    return {
      data: {
        id: 'transaction_id',
        status,
        created_at: '',
        finalized_at: '',
        amount_in_cents: 0,
        reference: '',
        customer_email: '',
        currency: '',
        payment_method_type: '',
        payment_method: {
          type: '',
          extra: {
            bin: '',
            name: '',
            brand: '',
            exp_year: '',
            card_type: '',
            exp_month: '',
            last_four: '',
            card_holder: '',
            is_three_ds: false,
            three_ds_auth_type: '',
            three_ds_auth: {
              three_ds_auth: {
                current_step: '',
                current_step_status: '',
              },
            },
            external_identifier: '',
            processor_response_code: '',
          },
          installments: 0,
        },
        status_message: '',
        billing_data: undefined,
        shipping_address: {
          address_line_1: '',
          country: '',
          region: '',
          city: '',
          phone_number: '',
          postal_code: '',
        },
        redirect_url: '',
        payment_source_id: '',
        payment_link_id: '',
        customer_data: {
          full_name: '',
        },
        bill_id: '',
        taxes: [],
        tip_in_cents: 0,
        merchant: {
          id: 0,
          name: '',
          legal_name: '',
          contact_name: '',
          phone_number: '',
          logo_url: '',
          legal_id_type: '',
          email: '',
          legal_id: '',
          public_key: '',
        },
        entries: [],
        disbursement: undefined,
        refunds: [],
      },
      meta: {},
    };
  }

  async function setupMockResponses(finalStatus: PaymentStatus) {
    const tokenizationResult = createMockCardTokenizationResponse();
    const createTransactionResult = createMockWompiTransactionResponse(
      PaymentStatus.PENDING,
    );
    const getTransactionResult =
      createMockWompiTransactionResponse(finalStatus);

    jest.spyOn(apiClient, 'tokenizeCard').mockResolvedValue(tokenizationResult);
    jest
      .spyOn(apiClient, 'createTransaction')
      .mockResolvedValue(createTransactionResult);
    jest
      .spyOn(apiClient, 'getTransaction')
      .mockResolvedValue(getTransactionResult);

    return {
      tokenizationResult,
      createTransactionResult,
      getTransactionResult,
    };
  }
});
