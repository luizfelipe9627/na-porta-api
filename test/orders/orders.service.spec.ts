import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { OrdersService } from '../../src/orders/orders.service';
import { OrderStatus } from '../../src/generated/prisma/enums';
import { OrderStatusEnum } from '../../src/orders/enum/order-status-api.enum';
import { FindOrdersDto } from '../../src/orders/dto/find-orders.dto';
import { jest } from '@jest/globals';
import Mock = jest.Mock;

type MockCustomer = {
  id: string;
  name: string;
  document: string;
};

type MockOrder = {
  id: string;
  orderNumber: string;
  deliveryForecast: Date;
  deliveryAddress: string;
  customerId: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  customer: MockCustomer;
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    orderId: string;
  }[];
};

type MockFindFirst = jest.Mock<
  (args: unknown) => Promise<MockOrder | { id: string } | null>
>;

type MockOrderMutation = jest.Mock<(...args: unknown[]) => Promise<MockOrder>>;

describe('OrdersService', () => {
  let service: OrdersService;
  let transaction: {
    customer: {
      upsert: jest.Mock<(args: unknown) => Promise<MockCustomer>>;
    };
    order: {
      findFirst: jest.Mock<
        (args: unknown) => Promise<MockOrder | { id: string } | null>
      >;
      create: jest.Mock<(args: unknown) => Promise<MockOrder>>;
      update: jest.Mock<(...args: unknown[]) => Promise<MockOrder>>;
    };
  };
  let prisma: {
    $transaction: Mock<(operation: unknown) => Promise<any>>;
    order: {
      findFirst: MockFindFirst;
      findMany: jest.Mock<(...args: unknown[]) => Promise<MockOrder[]>>;
      count: jest.Mock<(...args: unknown[]) => Promise<number>>;
      update: MockOrderMutation;
      create: MockOrderMutation;
    };
    customer: {
      upsert: jest.Mock<(...args: unknown[]) => Promise<MockCustomer>>;
    };
  } = {
    $transaction: jest.fn(),
    order: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    customer: {
      upsert: jest.fn(),
    },
  };

  const orderId = '8c5a6d42-41f1-4d6b-8d0e-12a456789abc';

  const order = {
    id: orderId,
    orderNumber: 'PED-TEST-001',
    deliveryForecast: new Date('2027-10-25T12:00:00.000Z'),
    deliveryAddress: 'Rua de teste, 123',
    customerId: 'customer-1',
    status: OrderStatus.PENDING,
    deletedAt: null,
    createdAt: new Date('2026-10-20T12:00:00.000Z'),
    updatedAt: new Date('2026-10-20T12:00:00.000Z'),
    customer: {
      id: 'customer-1',
      name: 'João Silva',
      document: '12345678900',
    },
    items: [
      {
        id: 'item-1',
        description: 'Produto de teste',
        quantity: 2,
        unitPrice: 25,
        orderId,
      },
    ],
  };

  beforeEach(async () => {
    transaction = {
      customer: {
        upsert: jest.fn(),
      },
      order: {
        findFirst: jest.fn<
          (args: unknown) => Promise<MockOrder | { id: string } | null>
        >(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    prisma.order.findFirst.mockReset();
    prisma.order.findMany.mockReset();
    prisma.order.count.mockReset();
    prisma.order.create.mockReset();
    prisma.order.update.mockReset();
    prisma.customer.upsert.mockReset();

    prisma.$transaction.mockReset();
    prisma.$transaction.mockImplementation(async (operation: unknown) => {
      if (typeof operation === 'function') {
        return operation(transaction);
      }

      return Promise.all(operation as Promise<unknown>[]);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('findFirst', () => {
    it('deve retornar o pedido encontrado sem expor customerId', async () => {
      prisma.order.findFirst.mockResolvedValue(order);

      const result = await service.getById(orderId);

      expect(prisma.order.findFirst).toHaveBeenCalledWith({
        where: {
          id: orderId,
          deletedAt: null,
        },
        include: {
          customer: true,
          items: true,
        },
      });

      expect(result).not.toHaveProperty('customerId');
    });

    it('deve propagar erros inesperados durante a busca', async () => {
      const error = new Error('Falha ao acessar o banco de dados');

      prisma.order.findFirst = jest
        .fn<() => Promise<typeof order | null>>()
        .mockRejectedValue(error);

      await expect(prisma.order.findFirst(orderId)).rejects.toThrow(
        'Falha ao acessar o banco de dados',
      );
    });

    it('deve lançar NotFoundException quando o pedido não existe', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(service.delete(orderId)).rejects.toThrow(
        new NotFoundException('Pedido não encontrado.'),
      );
    });

    it('deve lançar NotFoundException quando o pedido foi excluído logicamente', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(service.getById(orderId)).rejects.toThrow(
        new NotFoundException('Pedido não encontrado.'),
      );

      expect(prisma.order.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: orderId,
            deletedAt: null,
          },
        }),
      );
    });
  });

  describe('delete', () => {
    it('deve realizar a exclusão lógica do pedido', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: orderId });

      prisma.order.update.mockResolvedValue({
        ...order,
        deletedAt: new Date(),
      });

      await service.delete(orderId);

      expect(prisma.order.findFirst).toHaveBeenCalledWith({
        where: {
          id: orderId,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('deve propagar erros inesperados durante a exclusão', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: orderId });

      const error = new Error('Falha ao acessar o banco de dados');

      prisma.order.update.mockRejectedValue(error);

      await expect(service.delete(orderId)).rejects.toThrow(
        'Falha ao acessar o banco de dados',
      );
    });

    it('deve lançar NotFoundException quando o pedido não existe', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(service.delete(orderId)).rejects.toThrow(
        new NotFoundException('Pedido não encontrado.'),
      );

      expect(prisma.order.update).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando o pedido já foi excluído', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(service.delete(orderId)).rejects.toThrow(
        new NotFoundException('Pedido não encontrado.'),
      );
    });
  });

  describe('findMany', () => {
    it('deve retornar os pedidos com paginação', async () => {
     prisma.order.findMany.mockResolvedValue([order]);
      prisma.order.count.mockResolvedValue(1);

      const query = {
        page: 1,
        limit: 10,
      } as FindOrdersDto;

      const result = await service.getAll(query);

      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        },
        include: {
          customer: true,
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: 0,
        take: 10,
      });

      expect(prisma.order.count).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        },
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).not.toHaveProperty('customerId');
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });

    it('deve filtrar pedidos pelo número e pelo status', async () => {
     prisma.order.findMany.mockResolvedValue([order]);
      prisma.order.count.mockResolvedValue(1);

      const query = {
        orderNumber: 'PED-TEST-001',
        status: OrderStatusEnum.PENDENTE,
        page: 2,
        limit: 5,
      } as FindOrdersDto;

      await service.getAll(query);

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            deletedAt: null,
            orderNumber: 'PED-TEST-001',
            status: OrderStatus.PENDING,
          },
          skip: 5,
          take: 5,
        }),
      );
    });

    it('deve filtrar pedidos até a data final, incluindo o dia informado', async () => {
      prisma.order.findMany.mockResolvedValue([]);
      prisma.order.count.mockResolvedValue(0);

      await service.getAll({
        endDate: '2027-10-31',
        page: 1,
        limit: 10,
      });

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            deletedAt: null,
            createdAt: {
              lt: new Date('2027-11-01T00:00:00.000Z'),
            },
          },
        }),
      );
    });

    it('deve filtrar pedidos a partir da data inicial', async () => {
      prisma.order.findMany.mockResolvedValue([]);
      prisma.order.count.mockResolvedValue(0);

      await service.getAll({
        startDate: '2027-10-01',
        page: 1,
        limit: 10,
      });

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            deletedAt: null,
            createdAt: {
              gte: new Date('2027-10-01T00:00:00.000Z'),
            },
          },
        }),
      );
    });

    it('deve retornar uma lista vazia quando nenhum pedido for encontrado', async () => {
      prisma.order.findMany.mockResolvedValue([]);
      prisma.order.count.mockResolvedValue(0);

      const result = await service.getAll({
        page: 1,
        limit: 10,
      });

      expect(result).toEqual({
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      });

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { deletedAt: null },
        }),
      );
    });

    it('deve filtrar pedidos pelo intervalo de datas', async () => {
     prisma.order.findMany.mockResolvedValue([order]);
      prisma.order.count.mockResolvedValue(1);

      const query = {
        startDate: '2026-10-01',
        endDate: '2026-10-20',
        page: 1,
        limit: 10,
      } as FindOrdersDto;

      await service.getAll(query);

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            deletedAt: null,
            createdAt: {
              gte: new Date('2026-10-01T00:00:00.000Z'),
              lt: new Date('2026-10-21T00:00:00.000Z'),
            },
          },
        }),
      );
    });

    it('deve rejeitar quando a data inicial for posterior à data final', async () => {
      const query = {
        startDate: '2026-10-21',
        endDate: '2026-10-20',
        page: 1,
        limit: 10,
      } as FindOrdersDto;

      await expect(service.getAll(query)).rejects.toThrow(
        new BadRequestException(
          'A data inicial não pode ser posterior à data final.',
        ),
      );

      expect(prisma.order.findMany).not.toHaveBeenCalled();
      expect(prisma.order.count).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const createOrderDto = {
      orderNumber: 'PED-TEST-002',
      deliveryForecast: '2027-10-25T12:00:00.000Z',
      customerName: 'Maria Silva',
      customerDocument: '98765432100',
      deliveryAddress: 'Rua de teste, 456',
      status: OrderStatusEnum.PENDENTE,
      items: [
        {
          description: 'Produto de teste',
          quantity: 2,
          unitPrice: 25,
        },
      ],
    };

    const customer = {
      id: 'customer-2',
      name: createOrderDto.customerName,
      document: createOrderDto.customerDocument,
    };

    const createdOrder = {
      ...order,
      id: '9d6b7e53-52f2-4e7c-9e1f-23b567890abc',
      orderNumber: createOrderDto.orderNumber,
      customerId: customer.id,
      customer,
      status: OrderStatus.PENDING,
      items: [
        {
          id: 'item-2',
          description: 'Produto de teste',
          quantity: 2,
          unitPrice: 25,
          orderId: '9d6b7e53-52f2-4e7c-9e1f-23b567890abc',
        },
      ],
    };

    it('deve criar um pedido com cliente e itens', async () => {
      transaction.customer.upsert.mockResolvedValue(customer);
      transaction.order.create.mockResolvedValue(createdOrder);

      const result = await service.create(createOrderDto);

      expect(transaction.customer.upsert).toHaveBeenCalledWith({
        where: {
          document: createOrderDto.customerDocument,
        },
        update: {},
        create: {
          name: createOrderDto.customerName,
          document: createOrderDto.customerDocument,
        },
      });

      expect(transaction.order.create).toHaveBeenCalledWith({
        data: {
          orderNumber: createOrderDto.orderNumber,
          deliveryForecast: new Date(createOrderDto.deliveryForecast),
          customerId: customer.id,
          deliveryAddress: createOrderDto.deliveryAddress,
          status: OrderStatus.PENDING,
          items: {
            create: createOrderDto.items,
          },
        },
        include: {
          customer: true,
          items: true,
        },
      });

      expect(result).not.toHaveProperty('customerId');
      expect(result.status).toBe(OrderStatusEnum.PENDENTE);
      expect(result.customer).toEqual(customer);
      expect(result.items).toEqual(createdOrder.items);
    });

    it('deve propagar erros inesperados durante a criação', async () => {
      const error = new Error('Falha ao acessar o banco de dados');

      transaction.customer.upsert.mockRejectedValue(error);

      await expect(service.create(createOrderDto)).rejects.toThrow(
        'Falha ao acessar o banco de dados',
      );
    });

    it('deve reutilizar um cliente existente pelo documento', async () => {
      transaction.customer.upsert.mockResolvedValue(customer);
      transaction.order.create.mockResolvedValue(createdOrder);

      await service.create(createOrderDto);

      expect(transaction.customer.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            document: createOrderDto.customerDocument,
          },
          update: {},
        }),
      );

      expect(transaction.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            customerId: customer.id,
          }),
        }),
      );
    });

    it('deve lançar ConflictException quando o número do pedido já existe', async () => {
      transaction.order.findFirst.mockResolvedValue({
        id: orderId,
      });

      await expect(service.create(createOrderDto)).rejects.toThrow(
        'Já existe um pedido ativo com esse número.',
      );

      expect(transaction.order.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateOrderDto = {
      orderNumber: 'PED-TEST-003',
      deliveryForecast: '2027-10-25T12:00:00.000Z',
      customerName: 'Maria Silva',
      customerDocument: '98765432100',
      deliveryAddress: 'Rua de teste, 456',
      status: OrderStatusEnum.EM_ENTREGA,
      items: [
        {
          description: 'Produto atualizado',
          quantity: 2,
          unitPrice: 25,
        },
      ],
    };

    it('deve atualizar somente os itens do pedido', async () => {
      const items = [
        {
          description: 'Produto atualizado',
          quantity: 2,
          unitPrice: 25,
        },
      ];

      prisma.order.findFirst.mockResolvedValue(order);
      prisma.order.update.mockResolvedValue({
        ...order,
        items: items.map((item, index) => ({
          id: `item-${index + 1}`,
          orderId,
          ...item,
        })),
      });

      await service.update(orderId, { items });

      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            items: {
              deleteMany: {},
              create: items,
            },
          },
        }),
      );
    });

    it('deve propagar erros inesperados durante a atualização', async () => {
      prisma.order.findFirst.mockResolvedValue(order);

      const error = new Error('Falha ao acessar o banco de dados');

      prisma.order.update.mockRejectedValue(error);

      await expect(
        service.update(orderId, {
          deliveryAddress: 'Rua atualizada, 789',
        }),
      ).rejects.toThrow('Falha ao acessar o banco de dados');
    });

    it('deve atualizar somente os dados do cliente', async () => {
      prisma.order.findFirst.mockResolvedValue(order);
      prisma.order.update.mockResolvedValue({
        ...order,
        customer: {
          ...order.customer,
          name: 'Maria Silva',
        },
      });

      await service.update(orderId, {
        customerName: 'Maria Silva',
      });

      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            customer: {
              update: {
                name: 'Maria Silva',
              },
            },
          },
        }),
      );
    });

    it('deve atualizar somente os campos enviados', async () => {
      prisma.order.findFirst.mockResolvedValue(order);
      prisma.order.update.mockResolvedValue({
        ...order,
        deliveryAddress: 'Rua atualizada, 789',
      });

      await service.update(orderId, {
        deliveryAddress: 'Rua atualizada, 789',
      });

      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: orderId },
          data: {
            deliveryAddress: 'Rua atualizada, 789',
          },
          include: {
            customer: true,
            items: true,
          },
        }),
      );
    });

    it('deve atualizar um pedido existente', async () => {
      prisma.order.findFirst.mockResolvedValue(order);

      prisma.order.update.mockResolvedValue({
        ...order,
        ...updateOrderDto,
        deliveryForecast: new Date(updateOrderDto.deliveryForecast),
        customerId: 'customer-1',
        status: OrderStatus.IN_DELIVERY,
        customer: {
          id: 'customer-1',
          name: updateOrderDto.customerName,
          document: updateOrderDto.customerDocument,
        },
        items: [
          {
            id: 'item-2',
            orderId,
            ...updateOrderDto.items[0],
          },
        ],
      });

      const result = await service.update(orderId, updateOrderDto);

      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: orderId },
          data: expect.objectContaining({
            orderNumber: updateOrderDto.orderNumber,
            status: OrderStatus.IN_DELIVERY,
            customer: {
              update: {
                name: updateOrderDto.customerName,
                document: updateOrderDto.customerDocument,
              },
            },
            items: {
              deleteMany: {},
              create: updateOrderDto.items,
            },
          }),
          include: {
            customer: true,
            items: true,
          },
        }),
      );

      expect(result).not.toHaveProperty('customerId');
      expect(result.status).toBe(OrderStatusEnum.EM_ENTREGA);
    });

    it('deve lançar NotFoundException quando o pedido não existir', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(service.update(orderId, updateOrderDto)).rejects.toThrow(
        'Pedido não encontrado.',
      );

      expect(prisma.order.update).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando o pedido estiver excluído', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(service.update(orderId, updateOrderDto)).rejects.toThrow(
        'Pedido não encontrado.',
      );
    });

    it('deve rejeitar uma previsão de entrega inválida', async () => {
      prisma.order.findFirst.mockResolvedValue(order);

      await expect(
        service.update(orderId, {
          deliveryForecast: 'data-invalida',
        }),
      ).rejects.toThrow('Previsão de entrega inválida.');

      expect(prisma.order.update).not.toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando houver conflito de unicidade', async () => {
      prisma.order.findFirst.mockResolvedValue(order);

      const error = Object.assign(new Error('Unique constraint failed'), {
        code: 'P2002',
      });

      prisma.order.update.mockRejectedValue(error);

      await expect(service.update(orderId, updateOrderDto)).rejects.toThrow(
        'Já existe um pedido com esse número ou documento de cliente.',
      );
    });
  });
});
