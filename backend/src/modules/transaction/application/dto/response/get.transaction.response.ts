import { ApiProperty } from '@nestjs/swagger';

class DeliveryDto {
  @ApiProperty({ example: 15 })
  id: number;

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

class ProductDto {
  @ApiProperty({ example: 17 })
  id: number;

  @ApiProperty({ example: 'Modern Fresh Chicken' })
  name: string;

  @ApiProperty({ example: '631.35' })
  price: string;
}

class StatusDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'PENDING' })
  name: string;
}

export class GetTransactionResponse {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 10 })
  quantity: number;

  @ApiProperty({ example: '6314.50' })
  total: string;

  @ApiProperty({ type: DeliveryDto })
  delivery: DeliveryDto;

  @ApiProperty({ type: ProductDto })
  product: ProductDto;

  @ApiProperty({ type: StatusDto })
  status: StatusDto;
}
