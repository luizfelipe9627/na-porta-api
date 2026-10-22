import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiErrorResponseSchema } from '../schema/api-error-response.schema';

export function ApiOrderNotFoundError() {
  return applyDecorators(
    ApiNotFoundResponse({
      description: 'Pedido não encontrado ou já excluído.',
      type: ApiErrorResponseSchema,
      example: {
        message: 'Pedido não encontrado.',
        error: 'Not Found',
        statusCode: 404,
      },
    }),
  );
}
