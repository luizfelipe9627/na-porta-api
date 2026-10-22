import { applyDecorators } from '@nestjs/common';
import { ApiConflictResponse } from '@nestjs/swagger';
import { ApiErrorResponseSchema } from '../schema/api-error-response.schema';

export function ApiOrderConflictError() {
  return applyDecorators(
    ApiConflictResponse({
      description:
        'Já existe um pedido ativo com esse número ou ocorreu um conflito de dados.',
      type: ApiErrorResponseSchema,
      example: {
        message: 'Já existe um pedido ativo com esse número.',
        error: 'Conflict',
        statusCode: 409,
      },
    }),
  );
}
