import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/utils/validation-messages';
import { OrderStatusEnum } from '../enum/order-status-api.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindOrdersDto {
  @ApiPropertyOptional({
    description: 'Filtrar pelo número do pedido',
    example: 'PED-TEST-001',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.string('O número do pedido'),
  })
  @MaxLength(50, {
    message: VALIDATION_MESSAGES.maxLength('O número do pedido', 50),
  })
  orderNumber?: string;
  @ApiPropertyOptional({
    description: 'Filtrar pela data de início',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: VALIDATION_MESSAGES.validDate('A data inicial'),
    },
  )
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filtrar pela data de término',
    example: '2023-12-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: VALIDATION_MESSAGES.validDate('A data final'),
    },
  )
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filtrar pelo status do pedido',
    enum: OrderStatusEnum,
    enumName: 'OrderStatusEnum',
    example: OrderStatusEnum.EM_ENTREGA,
  })
  @IsOptional()
  @IsEnum(OrderStatusEnum, {
    message: VALIDATION_MESSAGES.validEnum('O status'),
  })
  status?: OrderStatusEnum;

  @ApiPropertyOptional({
    description: 'Número da página para paginação',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'A página deve ser um número inteiro.',
  })
  @Min(1, {
    message: 'A página deve ser no mínimo 1.',
  })
  page = 1;

  @ApiPropertyOptional({
    description: 'Número máximo de resultados por página para paginação',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'O limite deve ser um número inteiro.',
  })
  @Min(1, {
    message: 'O limite deve ser no mínimo 1.',
  })
  @Max(100, {
    message: 'O limite deve ser no máximo 100.',
  })
  limit = 10;
}
