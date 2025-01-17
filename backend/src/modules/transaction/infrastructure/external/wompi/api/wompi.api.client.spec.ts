import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { WompiApiClient } from './wompi.api.client';
import configuration from '@/src/app/config/configuration';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';

describe('WompiApiClient', () => {
  let service: WompiApiClient;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WompiApiClient,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
        {
          provide: configuration.KEY,
          useValue: {
            wompi: {
              apiUrl: 'https://sandbox.wompi.co/v1',
              publicKey: 'pub_test_key',
              privateKey: 'priv_test_key',
            },
          },
        },
      ],
    }).compile();

    service = module.get<WompiApiClient>(WompiApiClient);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should get presigned acceptance successfully', async () => {
    // Arrange
    const response = { data: { acceptance_token: 'token' } };
    const axiosResponse: AxiosResponse = {
      config: undefined,
      headers: undefined,
      status: 0,
      statusText: '',
      data: response,
    };
    jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

    // Act
    const result = await service.getPresignedAcceptance();

    // Assert
    expect(result).toEqual(response);
  });

  it('should throw an error if get presigned acceptance fails', async () => {
    // Arrange
    const error = new AxiosError('Request failed');
    jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => error));

    // Act & Assert
    await expect(service.getPresignedAcceptance()).rejects.toThrow(
      'Request failed',
    );
  });

  it('should tokenize card successfully', async () => {
    // Arrange
    const request = {
      number: '4242424242424242',
      cvc: '123',
      exp_month: '08',
      exp_year: '28',
      card_holder: 'José Pérez',
    };
    const response = { data: { token: 'card_token' } };
    const axiosResponse: AxiosResponse = {
      config: undefined,
      headers: undefined,
      status: 0,
      statusText: '',
      data: response,
    };
    jest.spyOn(httpService, 'post').mockReturnValue(of(axiosResponse));

    // Act
    const result = await service.tokenizeCard(request);

    // Assert
    expect(result).toEqual(response);
  });

  it('should throw an error if tokenize card fails', async () => {
    // Arrange
    const request = {
      number: '4242424242424242',
      cvc: '123',
      exp_month: '08',
      exp_year: '28',
      card_holder: 'José Pérez',
    };
    const error = new AxiosError('Request failed');
    jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => error));

    // Act & Assert
    await expect(service.tokenizeCard(request)).rejects.toThrow(
      'Request failed',
    );
  });

  it('should create transaction successfully', async () => {
    // Arrange
    const request = {
      acceptance_token: 'token',
      amount_in_cents: 3000000,
      currency: 'COP',
      signature: 'signature',
      customer_email: 'example@wompi.co',
      payment_method: {
        type: 'CARD',
        installments: 1,
        token: 'tok_stagtest_5113_49095De9a90458e711fCf345d034000B',
      },
      reference: 'PRUEBA_3_POSTMAN',
      customer_data: {
        full_name: 'Juan Alfonso Pérez Rodríguez',
      },
      shipping_address: {
        address_line_1: 'Calle 34 # 56 - 78',
        country: 'CO',
        region: 'aaaa',
        city: 'Bogotá',
        phone_number: '573109999999',
        postal_code: '111111',
      },
    };
    const response = { data: { id: 'transaction_id' } };
    const axiosResponse: AxiosResponse = {
      config: undefined,
      headers: undefined,
      status: 0,
      statusText: '',
      data: response,
    };
    jest.spyOn(httpService, 'post').mockReturnValue(of(axiosResponse));

    // Act
    const result = await service.createTransaction(request);

    // Assert
    expect(result).toEqual(response);
  });

  it('should throw an error if create transaction fails', async () => {
    // Arrange
    const request = {
      acceptance_token: 'token',
      amount_in_cents: 3000000,
      currency: 'COP',
      signature: 'signature',
      customer_email: 'example@wompi.co',
      payment_method: {
        type: 'CARD',
        installments: 1,
        token: 'tok_stagtest_5113_49095De9a90458e711fCf345d034000B',
      },
      reference: 'PRUEBA_3_POSTMAN',
      customer_data: {
        full_name: 'Juan Alfonso Pérez Rodríguez',
      },
      shipping_address: {
        address_line_1: 'Calle 34 # 56 - 78',
        country: 'CO',
        region: 'aaaa',
        city: 'Bogotá',
        phone_number: '573109999999',
        postal_code: '111111',
      },
    };
    const error = new AxiosError('Request failed');
    jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => error));

    // Act & Assert
    await expect(service.createTransaction(request)).rejects.toThrow(
      'Request failed',
    );
  });

  it('should get transaction successfully', async () => {
    // Arrange
    const transactionId = 'transaction_id';
    const response = { data: { id: transactionId } };
    const axiosResponse: AxiosResponse = {
      config: undefined,
      headers: undefined,
      status: 0,
      statusText: '',
      data: response,
    };
    jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

    // Act
    const result = await service.getTransaction(transactionId);

    // Assert
    expect(result).toEqual(response);
  });

  it('should throw an error if get transaction fails', async () => {
    // Arrange
    const transactionId = 'transaction_id';
    const error = new AxiosError('Request failed');
    jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => error));

    // Act & Assert
    await expect(service.getTransaction(transactionId)).rejects.toThrow(
      'Request failed',
    );
  });
});
