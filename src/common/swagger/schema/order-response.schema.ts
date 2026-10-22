import { ApiProperty } from '@nestjs/swagger';

export class OrderCustomerResponseSchema {
  @ApiProperty({ example: 'f30ff500-8d19-48fc-83ad-4dce9d1f9a49' })
  id: string;

  @ApiProperty({ example: 'João Silva' })
  name: string;

  @ApiProperty({ example: '12345678900' })
  document: string;
}

export class OrderItemResponseSchema {
  @ApiProperty({ example: 'b295414f-5b6f-411b-aeda-d01936401929' })
  id: string;

  @ApiProperty({ example: 'Teclado' })
  description: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({
    example: '149.9',
    description: 'Preço unitário retornado como texto.',
  })
  unitPrice: string;

  @ApiProperty({ example: '1bb8c05c-6652-4899-88cb-566bf8ccc9d2' })
  orderId: string;
}

export class OrderResponseSchema {
  @ApiProperty({ example: '1bb8c05c-6652-4899-88cb-566bf8ccc9d2' })
  id: string;

  @ApiProperty({ example: 'PED-TEST-001' })
  orderNumber: string;

  @ApiProperty({ example: '2026-10-25T00:00:00.000Z', format: 'date-time' })
  deliveryForecast: string;

  @ApiProperty({ example: 'Rua das Flores, 123' })
  deliveryAddress: string;

  @ApiProperty({ example: '2026-10-22T17:42:07.244Z', format: 'date-time' })
  createdAt: string;

  @ApiProperty({ example: '2026-10-22T17:42:07.244Z', format: 'date-time' })
  updatedAt: string;

  @ApiProperty({ example: '2026-10-22T18:42:07.244Z', format: 'date-time' })
  deletedAt: string | null;

  @ApiProperty({ type: OrderCustomerResponseSchema })
  customer: OrderCustomerResponseSchema;

  @ApiProperty({ type: [OrderItemResponseSchema] })
  items: OrderItemResponseSchema[];

  @ApiProperty({
    example: 'PENDENTE',
    enum: ['PENDENTE', 'EM_ENTREGA', 'ENTREGUE', 'CANCELADO'],
  })
  status: string;
}
