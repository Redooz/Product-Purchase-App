import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty, IsPhoneNumber,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class DeliveryInfo {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  personName: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'US' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  country: string;

  @ApiProperty({ example: 'California' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ example: 'San Francisco' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: '10001' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ example: '+573118617627' })
  @IsPhoneNumber('CO')
  phoneNumber: string;
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
