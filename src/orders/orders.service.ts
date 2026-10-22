import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { OrderStatus, Prisma } from '../generated/prisma/client';
import { UpdateOrderDto } from './dto/update-order.dto';

import {
  API_TO_ORDER_STATUS,
  ORDER_STATUS_TO_API,
} from '../mapper/order-status-mapper';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private formatOrder<T extends { customerId: string; status: OrderStatus }>({
    customerId: _customerId,
    status,
    ...order
  }: T) {
    return {
      ...order,
      status: ORDER_STATUS_TO_API[status],
    };
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const order = await this.prisma.$transaction(async (transaction) => {
        const existingOrder = await transaction.order.findFirst({
          where: {
            orderNumber: createOrderDto.orderNumber,
            deletedAt: null,
          },
          select: {
            id: true,
          },
        });

        if (existingOrder) {
          throw new ConflictException(
            'Já existe um pedido ativo com esse número.',
          );
        }

        const customer = await transaction.customer.upsert({
          where: {
            document: createOrderDto.customerDocument,
          },
          update: {},
          create: {
            name: createOrderDto.customerName,
            document: createOrderDto.customerDocument,
          },
        });

        return transaction.order.create({
          data: {
            orderNumber: createOrderDto.orderNumber,
            deliveryForecast: new Date(createOrderDto.deliveryForecast),
            customerId: customer.id,
            deliveryAddress: createOrderDto.deliveryAddress,
            status: API_TO_ORDER_STATUS[createOrderDto.status],
            items: {
              create: createOrderDto.items.map((item) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              })),
            },
          },
          include: {
            customer: true,
            items: true,
          },
        });
      });

      return this.formatOrder(order);
    } catch (error) {
      throw error;
    }
  }

  async getAll(query: FindOrdersDto) {
    const { orderNumber, startDate, endDate, status, page, limit } = query;

    if (startDate && endDate && startDate > endDate) {
      throw new BadRequestException(
        'A data inicial não pode ser posterior à data final.',
      );
    }

    const dateFilter =
      startDate || endDate
        ? {
            createdAt: {
              ...(startDate && {
                gte: new Date(`${startDate.slice(0, 10)}T00:00:00.000Z`),
              }),
              ...(endDate && {
                lt: new Date(
                  new Date(`${endDate.slice(0, 10)}T00:00:00.000Z`).getTime() +
                    24 * 60 * 60 * 1000,
                ),
              }),
            },
          }
        : {};

    const where: Prisma.OrderWhereInput = {
      deletedAt: null,
      ...(orderNumber && { orderNumber }),
      ...(status && { status: API_TO_ORDER_STATUS[status] }),
      ...dateFilter,
    };
    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: { customer: true, items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((order) => this.formatOrder(order)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, deletedAt: null },
      include: { customer: true, items: true },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    return this.formatOrder(order);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const existingOrder = await this.prisma.order.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingOrder) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    if (
      updateOrderDto.deliveryForecast !== undefined &&
      Number.isNaN(Date.parse(updateOrderDto.deliveryForecast))
    ) {
      throw new BadRequestException('Previsão de entrega inválida.');
    }

    const {
      orderNumber,
      deliveryForecast,
      customerName,
      customerDocument,
      deliveryAddress,
      status,
      items,
    } = updateOrderDto;

    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          ...(orderNumber !== undefined && { orderNumber }),
          ...(deliveryForecast !== undefined && {
            deliveryForecast: new Date(deliveryForecast),
          }),
          ...(deliveryAddress !== undefined && { deliveryAddress }),
          ...(status !== undefined && {
            status: API_TO_ORDER_STATUS[status],
          }),
          ...((customerName !== undefined ||
            customerDocument !== undefined) && {
            customer: {
              update: {
                ...(customerName !== undefined && { name: customerName }),
                ...(customerDocument !== undefined && {
                  document: customerDocument,
                }),
              },
            },
          }),
          ...(items !== undefined && {
            items: {
              deleteMany: {},
              create: items.map((item) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              })),
            },
          }),
        },
        include: {
          customer: true,
          items: true,
        },
      });

      return this.formatOrder(updatedOrder);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        throw new ConflictException(
          'Já existe um pedido com esse número ou documento de cliente.',
        );
      }

      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    await this.prisma.order.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
