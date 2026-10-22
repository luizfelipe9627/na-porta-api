import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse as SwaggerApiCreatedResponse } from '@nestjs/swagger';
import { OrderResponseSchema } from '../schema/order-response.schema';

export function ApiOrderCreatedResponse() {
  return applyDecorators(
    SwaggerApiCreatedResponse({
      description: 'Pedido criado com sucesso.',
      type: OrderResponseSchema,
    }),
  );
}
