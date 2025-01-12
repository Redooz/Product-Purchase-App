import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { GetAcceptanceResponse } from '@/transaction/infrastructure/external/wompi/dto/response/get.acceptance.response';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import configuration from '@/src/app/config/configuration';

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
}
