import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../../src/orders/orders.controller';
import { OrdersService } from '../../src/orders/orders.service';
import { CreateOrderDto } from '../../src/orders/dto/create-order.dto';
import { FindOrdersDto } from '../../src/orders/dto/find-orders.dto';
import { UpdateOrderDto } from '../../src/orders/dto/update-order.dto';
import { jest } from '@jest/globals';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: jest.Mocked<
    Pick<OrdersService, 'create' | 'getAll' | 'getById' | 'update' | 'delete'>
  >;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve encaminhar os dados ao criar um pedido', async () => {
    const dto = { orderNumber: 'PED-TEST-001' } as CreateOrderDto;
    const expected = { id: 'pedido-1' };

    service.create.mockResolvedValue(expected as never);

    await expect(controller.create(dto)).resolves.toEqual(expected);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('deve encaminhar os filtros ao listar pedidos', async () => {
    const query = { page: 1, limit: 10 } as FindOrdersDto;
    const expected = { data: [], pagination: {} };

    service.getAll.mockResolvedValue(expected as never);

    await expect(controller.getAll(query)).resolves.toEqual(expected);
    expect(service.getAll).toHaveBeenCalledWith(query);
  });

  it('deve encaminhar o ID ao buscar um pedido', async () => {
    const id = '8c5a6d42-41f1-4d6b-8d0e-12a456789abc';
    const expected = { id };

    service.getById.mockResolvedValue(expected as never);

    await expect(controller.getById(id)).resolves.toEqual(expected);
    expect(service.getById).toHaveBeenCalledWith(id);
  });

  it('deve encaminhar o ID e os dados ao atualizar um pedido', async () => {
    const id = '8c5a6d42-41f1-4d6b-8d0e-12a456789abc';
    const dto = { deliveryAddress: 'Rua de teste, 123' } as UpdateOrderDto;
    const expected = { id, deliveryAddress: dto.deliveryAddress };

    service.update.mockResolvedValue(expected as never);

    await expect(controller.update(id, dto)).resolves.toEqual(expected);
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('deve encaminhar o ID ao excluir um pedido', async () => {
    const id = '8c5a6d42-41f1-4d6b-8d0e-12a456789abc';
    const expected = { message: 'Pedido excluído com sucesso.' };

    service.delete.mockResolvedValue(expected as never);

    await expect(controller.delete(id)).resolves.toEqual(expected);
    expect(service.delete).toHaveBeenCalledWith(id);
  });
});
