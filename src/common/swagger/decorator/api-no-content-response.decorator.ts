import { applyDecorators } from '@nestjs/common';
import { ApiNoContentResponse } from '@nestjs/swagger';

export function ApiOrderDeletedResponse() {
  return applyDecorators(
    ApiNoContentResponse({
      description: 'Pedido excluído logicamente com sucesso.',
    }),
  );
}
