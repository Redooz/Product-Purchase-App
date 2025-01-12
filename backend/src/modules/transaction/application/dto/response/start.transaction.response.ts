import { ApiProperty } from '@nestjs/swagger';

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
}
