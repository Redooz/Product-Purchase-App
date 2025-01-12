import { AcceptanceServicePort } from '@/transaction/domain/spi/acceptance.service.port';
import { Injectable } from '@nestjs/common';
import { Acceptance } from '@/transaction/domain/model/acceptance';
import { WompiApiClient } from '@/transaction/infrastructure/external/wompi/api/wompi.api.client';
import { AcceptanceType } from '@/transaction/domain/model/enum/acceptance.type';

@Injectable()
export class WompiAcceptanceServiceAdapter extends AcceptanceServicePort {
  constructor(private readonly apiClient: WompiApiClient) {
    super();
  }

  async getAllPresignedAcceptances(): Promise<Acceptance[]> {
    const response = await this.apiClient.getPresignedAcceptance();

    const acceptanceEndUserPolicy: Acceptance = {
      acceptanceToken: response.data.presigned_acceptance.acceptance_token,
      type: response.data.presigned_acceptance.type as AcceptanceType,
      permalink: response.data.presigned_acceptance.permalink,
    };

    const acceptancePersonalDataAuth: Acceptance = {
      acceptanceToken:
        response.data.presigned_personal_data_auth.acceptance_token,
      type: response.data.presigned_personal_data_auth.type as AcceptanceType,
      permalink: response.data.presigned_personal_data_auth.permalink,
    };

    return [acceptanceEndUserPolicy, acceptancePersonalDataAuth];
  }
}
