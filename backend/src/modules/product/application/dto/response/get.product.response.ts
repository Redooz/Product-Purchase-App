import { ApiProperty } from '@nestjs/swagger';

export class GetProductResponse {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the product',
  })
  id: number;

  @ApiProperty({
    example: 'Product Name',
    description: 'The name of the product',
  })
  name: string;

  @ApiProperty({
    example: 'Product Description',
    description: 'The description of the product',
  })
  description: string;

  @ApiProperty({ example: 100.0, description: 'The price of the product' })
  price: number;

  @ApiProperty({
    example: 10,
    description: 'The stock quantity of the product',
  })
  stock: number;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'The URL of the product image',
    required: false,
  })
  image?: string;
}
