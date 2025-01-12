import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DeliveryInfo {
  @ApiProperty({ example: 'John Doe' })
  personName: string;

  @ApiProperty({ example: '123 Main St' })
  address: string;

  @ApiProperty({ example: 'USA' })
  country: string;

  @ApiProperty({ example: 'New York' })
  city: string;

  @ApiProperty({ example: '10001' })
  postalCode: string;
}

export class StartTransactionRequest {
  @ApiProperty({ example: 10 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 17 })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ type: DeliveryInfo })
  @ValidateNested()
  @Type(() => DeliveryInfo)
  deliveryInfo: DeliveryInfo;
}