import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';
import { VALIDATION_MESSAGES } from '../../common/utils/validation-messages';
import { OrderStatusEnum } from '../enum/order-status-api.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Número identificador do pedido.',
    example: 'PED-TEST-001',
    maxLength: 50,
  })
  @IsString({
    message: VALIDATION_MESSAGES.string('O número do pedido'),
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.required('O número do pedido'),
  })
  @MaxLength(50, {
    message: VALIDATION_MESSAGES.maxLength('O número do pedido', 50),
  })
  orderNumber: string;

  @ApiProperty({
    description: 'Data prevista para a entrega do pedido.',
    example: '2027-10-30T14:00:00.000Z',
    format: 'date-time',
  })
  @IsDateString(
    {},
    {
      message: VALIDATION_MESSAGES.validDate('A previsão de entrega'),
    },
  )
  deliveryForecast: string;

  @ApiProperty({
    description: 'Nome do cliente que realizou o pedido.',
    example: 'João Silva',
    maxLength: 150,
  })
  @IsString({
    message: VALIDATION_MESSAGES.string('O nome do cliente'),
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.required('O nome do cliente'),
  })
  @MaxLength(150, {
    message: VALIDATION_MESSAGES.maxLength('O nome do cliente', 150),
  })
  customerName: string;

  @ApiProperty({
    description: 'Documento do cliente, como CPF ou CNPJ.',
    example: '12345678901',
    maxLength: 20,
  })
  @IsString({
    message: VALIDATION_MESSAGES.string('O documento do cliente'),
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.required('O documento do cliente'),
  })
  @MaxLength(20, {
    message: VALIDATION_MESSAGES.maxLength('O documento do cliente', 20),
  })
  customerDocument: string;

  @ApiProperty({
    description: 'Endereço onde o pedido será entregue.',
    example: 'Rua das Flores, 123, São Paulo - SP',
    maxLength: 255,
  })
  @IsString({
    message: VALIDATION_MESSAGES.string('O endereço de entrega'),
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.required('O endereço de entrega'),
  })
  @MaxLength(255, {
    message: VALIDATION_MESSAGES.maxLength('O endereço de entrega', 255),
  })
  deliveryAddress: string;

  @ApiProperty({
    description: 'Status atual do pedido.',
    enum: OrderStatusEnum,
    enumName: 'OrderStatusEnum',
    example: OrderStatusEnum.PENDENTE,
    default: OrderStatusEnum.PENDENTE,
  })
  @IsEnum(OrderStatusEnum, {
    message: VALIDATION_MESSAGES.validEnum('O status'),
  })
  status: OrderStatusEnum = OrderStatusEnum.PENDENTE;

  @ApiProperty({
    description: 'Lista de itens que compõem o pedido.',
    type: [CreateOrderItemDto],
    minItems: 1,
    example: [
      {
        description: 'Produto de teste',
        price: 99.9,
      },
    ],
  })
  @IsArray({
    message: VALIDATION_MESSAGES.array('Os itens do pedido'),
  })
  @ArrayMinSize(1, {
    message: VALIDATION_MESSAGES.minArraySize('O pedido', 1),
  })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
