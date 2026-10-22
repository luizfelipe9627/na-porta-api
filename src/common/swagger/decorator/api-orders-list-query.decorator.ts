import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { OrderStatusEnum } from '../../../orders/enum/order-status-api.enum';

export function ApiOrdersListQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'orderNumber',
      required: false,
      description: 'Filtra pedidos pelo número do pedido.',
      schema: {
        type: 'string',
        maxLength: 50,
        example: 'PED-TEST-001',
      },
    }),
    ApiQuery({
      name: 'startDate',
      required: false,
      description: 'Data inicial para filtrar pedidos pela data de criação.',
      schema: {
        type: 'string',
        format: 'date',
        example: '2027-10-01',
      },
    }),
    ApiQuery({
      name: 'endDate',
      required: false,
      description: 'Data final para filtrar pedidos pela data de criação.',
      schema: {
        type: 'string',
        format: 'date',
        example: '2027-10-31',
      },
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filtra pedidos pelo status.',
      schema: {
        type: 'string',
        enum: Object.values(OrderStatusEnum),
        example: OrderStatusEnum.EM_ENTREGA,
      },
    }),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número da página dos resultados.',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Quantidade máxima de pedidos por página.',
      example: 10,
    }),
  );
}
