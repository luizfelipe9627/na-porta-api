import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseSchema {
  @ApiProperty({
    example: 'Pedido não encontrado.',
    description: 'Mensagem ou lista de mensagens do erro.',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string | string[];

  @ApiProperty({
    example: 'Not Found',
  })
  error: string;

  @ApiProperty({
    example: 404,
  })
  statusCode: number;
}
