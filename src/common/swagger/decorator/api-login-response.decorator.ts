import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiLoginResponse() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Autenticação realizada com sucesso.',
      schema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            example: 'string',
          },
          token_type: {
            type: 'string',
            example: 'Bearer',
          },
          expires_in: {
            type: 'number',
            example: 3600,
          },
          expires_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-10-22T15:08:29-03:00',
          },
        },
        example: {
          access_token: 'string',
          token_type: 'Bearer',
          expires_in: 3600,
          expires_at: '2026-10-22T15:08:29-03:00',
        },
      },
    }),
  );
}
