import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/utils/validation-messages';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Descrição do item do pedido.',
    example: 'Teclado mecânico',
    maxLength: 255,
  })
  @IsString({
    message: VALIDATION_MESSAGES.string('A descrição do item'),
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.required('A descrição do item'),
  })
  @MaxLength(255, {
    message: VALIDATION_MESSAGES.maxLength('A descrição do item', 255),
  })
  description: string;

  @ApiProperty({
    description: 'Quantidade de unidades do item.',
    example: 2,
    type: 'integer',
    minimum: 1,
  })
  @IsInt({
    message: 'A quantidade deve ser um número inteiro.',
  })
  @Min(1, {
    message: 'A quantidade deve ser maior ou igual a 1.',
  })
  quantity: number;

  @ApiProperty({
    description: 'Preço unitário do item.',
    example: 149.9,
    type: 'number',
    minimum: 0,
    multipleOf: 0.01,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'O preço unitário deve ser um número com no máximo 2 casas decimais.',
    },
  )
  @IsPositive({
    message: 'O preço unitário deve ser maior que zero.',
  })
  unitPrice: number;
}
