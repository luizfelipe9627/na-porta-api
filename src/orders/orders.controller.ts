import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { FindOrdersDto } from './dto/find-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ParseUuidPipe } from '../common/utils/parse-uuid.pipe';
import { ApiOrderNotFoundError } from '../common/swagger/decorator/api-not-found-response.decorator';
import { ApiBadRequestError } from '../common/swagger/decorator/api-bad-request-response.decorator';
import { ApiOrderDeletedResponse } from '../common/swagger/decorator/api-no-content-response.decorator';
import { ApiOrderConflictError } from '../common/swagger/decorator/api-conflict-response.decorator';
import {
  ApiOrderOkResponse,
  ApiOrdersListOkResponse,
} from '../common/swagger/decorator/api-ok-response.decorator';
import { ApiOrderCreatedResponse } from '../common/swagger/decorator/api-created-response.decorator';
import { ApiUnauthorizedError } from '../common/swagger/decorator/api-unauthorized-response.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ORDER_REQUEST_EXAMPLES } from '../common/swagger/example/order.example';
import { ApiOrdersListQuery } from '../common/swagger/decorator/api-orders-list-query.decorator';

@Controller('orders')
@ApiBearerAuth()
@ApiTags('Pedidos')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      createOrder: ORDER_REQUEST_EXAMPLES.create,
    },
  })
  @ApiOrderCreatedResponse()
  @ApiBadRequestError()
  @ApiOrderConflictError()
  @ApiUnauthorizedError()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todos os pedidos com ou sem filtros' })
  @HttpCode(HttpStatus.OK)
  @ApiOrdersListOkResponse()
  @ApiBadRequestError()
  @ApiUnauthorizedError()
  @ApiOrdersListQuery()
  getAll(@Query() query: FindOrdersDto) {
    return this.ordersService.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um pedido pelo ID' })
  @HttpCode(HttpStatus.OK)
  @ApiOrderOkResponse()
  @ApiBadRequestError()
  @ApiOrderNotFoundError()
  @ApiUnauthorizedError()
  getById(@Param('id', ParseUuidPipe) id: string) {
    return this.ordersService.getById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um pedido existente' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: UpdateOrderDto,
    examples: {
      updateCustomer: ORDER_REQUEST_EXAMPLES.updateCustomer,
      updateStatus: ORDER_REQUEST_EXAMPLES.updateStatus,
      updateItems: ORDER_REQUEST_EXAMPLES.updateItems,
    },
  })
  @ApiOrderOkResponse()
  @ApiBadRequestError()
  @ApiOrderNotFoundError()
  @ApiOrderConflictError()
  @ApiUnauthorizedError()
  update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um pedido existente (soft delete)' })
  @ApiOrderDeletedResponse()
  @ApiBadRequestError()
  @ApiOrderNotFoundError()
  @ApiUnauthorizedError()
  delete(@Param('id', ParseUuidPipe) id: string) {
    return this.ordersService.delete(id);
  }
}
