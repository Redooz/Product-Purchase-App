import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { GetAcceptanceResponse } from '@/transaction/infrastructure/external/wompi/dto/response/get.acceptance.response';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import configuration from '@/src/app/config/configuration';
import { CardTokenizationRequest } from '@/transaction/infrastructure/external/wompi/dto/request/card.tokenization.request';
import { CardTokenizationResponse } from '@/transaction/infrastructure/external/wompi/dto/response/card.tokenization.response';
import { CreateWompiTransactionRequest } from '@/transaction/infrastructure/external/wompi/dto/request/create.wompi.transaction.request';
import { CreateWompiTransactionResponse } from '@/transaction/infrastructure/external/wompi/dto/response/create.wompi.transaction.response';
import { GetWompiTransactionResponse } from '@/transaction/infrastructure/external/wompi/dto/response/get.wompi.transaction.response';

@Injectable()
export class WompiApiClient {
  constructor(
    @Inject(configuration.KEY)
    private readonly configService: ConfigType<typeof configuration>,
    private readonly httpClient: HttpService,
  ) {}

  async getPresignedAcceptance(): Promise<GetAcceptanceResponse> {
    const url = this.configService.wompi.apiUrl;
    const pubApiKey = this.configService.wompi.publicKey;

    const { data } = await firstValueFrom(
      this.httpClient.get(`${url}/merchants/${pubApiKey}`).pipe(
        catchError((error: AxiosError) => {
          throw new Error(error.message);
        }),
      ),
    );

    return data;
  }

  async tokenizeCard(
    request: CardTokenizationRequest,
  ): Promise<CardTokenizationResponse> {
    const url = this.configService.wompi.apiUrl;
    const pubApiKey = this.configService.wompi.publicKey;

    const { data } = await firstValueFrom(
      this.httpClient
        .post(`${url}/tokens/cards`, request, {
          headers: {
            Authorization: `Bearer ${pubApiKey}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new Error(error.message);
          }),
        ),
    );

    return data;
  }

  async createTransaction(
    request: CreateWompiTransactionRequest,
  ): Promise<CreateWompiTransactionResponse> {
    const url = this.configService.wompi.apiUrl;
    const privApiKey = this.configService.wompi.privateKey;

    const { data } = await firstValueFrom(
      this.httpClient
        .post(`${url}/transactions`, request, {
          headers: {
            Authorization: `Bearer ${privApiKey}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new Error(error.message);
          }),
        ),
    );

    return data;
  }

  async getTransaction(
    transactionId: string,
  ): Promise<GetWompiTransactionResponse> {
    const url = this.configService.wompi.apiUrl;
    const privApiKey = this.configService.wompi.privateKey;

    const { data } = await firstValueFrom(
      this.httpClient
        .get(`${url}/transactions/${transactionId}`, {
          headers: {
            Authorization: `Bearer ${privApiKey}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new Error(error.message);
          }),
        ),
    );

    return data;
  }
}
