import { Test, TestingModule } from '@nestjs/testing';
import { WompiAcceptanceServiceAdapter } from './wompi.acceptance.service.adapter';
import { WompiApiClient } from '@/transaction/infrastructure/external/wompi/api/wompi.api.client';
import { AcceptanceType } from '@/transaction/domain/model/enum/acceptance.type';
import { GetAcceptanceResponse } from '@/transaction/infrastructure/external/wompi/dto/response/get.acceptance.response';

describe('WompiAcceptanceServiceAdapter', () => {
  let service: WompiAcceptanceServiceAdapter;
  let apiClient: WompiApiClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WompiAcceptanceServiceAdapter,
        {
          provide: WompiApiClient,
          useValue: {
            getPresignedAcceptance: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WompiAcceptanceServiceAdapter>(
      WompiAcceptanceServiceAdapter,
    );
    apiClient = module.get<WompiApiClient>(WompiApiClient);
  });

  it('should get all presigned acceptances successfully', async () => {
    // Arrange
    const response: GetAcceptanceResponse = {
      data: {
        presigned_acceptance: {
          acceptance_token: 'token1',
          type: 'END_USER_POLICY',
          permalink: 'https://example.com/end_user_policy',
        },
        presigned_personal_data_auth: {
          acceptance_token: 'token2',
          type: 'PERSONAL_DATA_AUTH',
          permalink: 'https://example.com/personal_data_auth',
        },
        id: 0,
        name: '',
        email: '',
        contact_name: '',
        phone_number: '',
        active: false,
        logo_url: '',
        legal_name: '',
        legal_id_type: '',
        legal_id: '',
        public_key: '',
        accepted_currencies: [],
        fraud_javascript_key: '',
        fraud_groups: [],
        accepted_payment_methods: [],
        payment_methods: [],
      },
      meta: {},
    };
    jest.spyOn(apiClient, 'getPresignedAcceptance').mockResolvedValue(response);

    // Act
    const result = await service.getAllPresignedAcceptances();

    // Assert
    expect(result).toEqual([
      {
        acceptanceToken: 'token1',
        type: AcceptanceType.END_USER_POLICY,
        permalink: 'https://example.com/end_user_policy',
      },
      {
        acceptanceToken: 'token2',
        type: AcceptanceType.PERSONAL_DATA_AUTHORIZATION,
        permalink: 'https://example.com/personal_data_auth',
      },
    ]);
  });
});
