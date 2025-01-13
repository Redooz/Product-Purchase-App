import { ApiProperty } from '@nestjs/swagger';
import {
  IsCreditCard,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CardDto {
  @ApiProperty()
  @IsCreditCard()
  number: string;

  @ApiProperty()
  @IsString()
  @MaxLength(4)
  cvc: string;

  @ApiProperty()
  @IsString()
  @MaxLength(2)
  expMonth: string;

  @ApiProperty()
  @IsString()
  @MaxLength(2)
  expYear: string;

  @ApiProperty()
  @IsString()
  cardHolder: string;
}

export class FinishTransactionRequest {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  transactionId: number;

  @ApiProperty({
    type: CardDto,
  })
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;
}
