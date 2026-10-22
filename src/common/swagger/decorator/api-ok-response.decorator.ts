import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse as SwaggerApiOkResponse } from '@nestjs/swagger';
import { OrderResponseSchema } from '../schema/order-response.schema';
import { PaginatedOrdersResponseSchema } from '../schema/paginated-orders-response.schema';

export function ApiOrderOkResponse() {
  return applyDecorators(
    SwaggerApiOkResponse({
      description: 'Pedido consultado ou atualizado com sucesso.',
      type: OrderResponseSchema,
    }),
  );
}

export function ApiOrdersListOkResponse() {
  return applyDecorators(
    SwaggerApiOkResponse({
      description: 'Lista de pedidos consultada com sucesso.',
      type: PaginatedOrdersResponseSchema,
    }),
  );
}
