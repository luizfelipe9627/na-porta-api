import { ApiProperty } from '@nestjs/swagger';
import { OrderResponseSchema } from './order-response.schema';

export class OrderPaginationSchema {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 6 })
  total: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}

export class PaginatedOrdersResponseSchema {
  @ApiProperty({ type: [OrderResponseSchema] })
  data: OrderResponseSchema[];

  @ApiProperty({ type: OrderPaginationSchema })
  pagination: OrderPaginationSchema;
}
