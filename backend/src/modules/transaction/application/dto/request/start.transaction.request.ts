import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DeliveryInfo {
  @IsString()
  @IsNotEmpty()
  personName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;
}

export class StartTransactionRequest {
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsInt()
  @IsPositive()
  productId: number;

  @ValidateNested()
  @Type(() => DeliveryInfo)
  deliveryInfo: DeliveryInfo;
}
