import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiUnauthorizedError(
  message = 'Autenticação necessária. Informe um token Bearer válido.',
) {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: message,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: message,
          },
          error: {
            type: 'string',
            example: 'Unauthorized',
          },
          statusCode: {
            type: 'number',
            example: 401,
          },
        },
        example: {
          message,
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
  );
}
