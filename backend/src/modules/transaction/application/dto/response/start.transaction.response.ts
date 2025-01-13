import { ApiProperty } from '@nestjs/swagger';

class AcceptanceDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MjQzLCJwZXJtYWxpbmsiOiJodHRwczovL3dvbXBpLmNvbS9hc3NldHMvZG93bmxvYWRibGUvcmVnbGFtZW50by1Vc3Vhcmlvcy1Db2xvbWJpYS5wZGYiLCJmaWxlX2hhc2giOiJkMWVkMDI3NjhlNDEzZWEyMzFmNzAwMjc0N2Y0N2FhOSIsImppdCI6IjE3MzY3MDI0MzUtMjcxNzEiLCJlbWFpbCI6IiIsImV4cCI6MTczNjcwNjAzNX0.981XGKweHjUx7YzJCybwwpbVtnxW7dqEAG_0zt3aJrI',
    description: 'Acceptance token',
  })
  acceptanceToken: string;

  @ApiProperty({
    example:
      'https://wompi.com/assets/downloadble/reglamento-Usuarios-Colombia.pdf',
    description: 'Permalink',
  })
  permalink: string;

  @ApiProperty({
    example: 'END_USER_POLICY',
    description: 'Type',
  })
  type: string;
}

export class StartTransactionResponse {
  @ApiProperty({
    example: 1,
    description: 'Transaction ID',
  })
  id: number;

  @ApiProperty({
    example: 100,
    description: 'Transaction total',
  })
  total: number;

  @ApiProperty({
    example: 'pending',
    description: 'Transaction status',
  })
  status: string;

  @ApiProperty({
    example: 10,
    description: 'Delivery fee',
  })
  deliveryFee: number;

  @ApiProperty({
    type: AcceptanceDto,
  })
  endUserPolicy: AcceptanceDto;

  @ApiProperty({
    type: AcceptanceDto,
  })
  personalDataAuthorization: AcceptanceDto;
}
