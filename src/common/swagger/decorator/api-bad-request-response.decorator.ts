import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { ApiErrorResponseSchema } from '../schema/api-error-response.schema';

export function ApiBadRequestError() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Os dados enviados ou o ID informado são inválidos.',
      type: ApiErrorResponseSchema,
      examples: {
        validationError: {
          summary: 'Erro de validação',
          value: {
            message: ['O status informado não é válido.'],
            error: 'Bad Request',
            statusCode: 400,
          },
        },
        invalidUuid: {
          summary: 'UUID inválido',
          value: {
            message: 'O ID informado não é um UUID válido.',
            error: 'Bad Request',
            statusCode: 400,
          },
        },
        unknownProperty: {
          summary: 'Campo não permitido',
          value: {
            message: ['O campo campoInexistente não é permitido.'],
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    }),
  );
}
