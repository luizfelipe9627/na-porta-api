import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { OrderStatus } from '../src/generated/prisma/enums';
import * as bcrypt from 'bcrypt';

const pedidos = [
  {
    orderNumber: 'PED-DEMO-001',
    deliveryForecast: new Date('2026-10-23T00:00:00.000Z'),
    deliveryAddress: 'Rua das Flores, 100, São Paulo - SP',
    status: OrderStatus.PENDING,
    customer: {
      name: 'João Silva',
      document: '11111111111',
    },
    items: [
      { description: 'Teclado mecânico', quantity: 1, unitPrice: 249.9 },
      { description: 'Mouse sem fio', quantity: 1, unitPrice: 129.9 },
    ],
  },
  {
    orderNumber: 'PED-DEMO-002',
    deliveryForecast: new Date('2026-10-22T00:00:00.000Z'),
    deliveryAddress: 'Avenida Paulista, 500, São Paulo - SP',
    status: OrderStatus.IN_DELIVERY,
    customer: {
      name: 'Maria Oliveira',
      document: '22222222222',
    },
    items: [
      {
        description: 'Monitor 24 polegadas',
        quantity: 1,
        unitPrice: 899.9,
      },
    ],
  },
  {
    orderNumber: 'PED-DEMO-003',
    deliveryForecast: new Date('2026-10-19T00:00:00.000Z'),
    deliveryAddress: 'Rua Paraná, 250, Curitiba - PR',
    status: OrderStatus.DELIVERED,
    customer: {
      name: 'Carlos Santos',
      document: '33333333333',
    },
    items: [
      { description: 'Headset gamer', quantity: 1, unitPrice: 199.9 },
      { description: 'Mousepad', quantity: 2, unitPrice: 39.9 },
    ],
  },
  {
    orderNumber: 'PED-DEMO-004',
    deliveryForecast: new Date('2026-10-24T00:00:00.000Z'),
    deliveryAddress: 'Rua do Comércio, 80, Campinas - SP',
    status: OrderStatus.CANCELED,
    customer: {
      name: 'Ana Costa',
      document: '44444444444',
    },
    items: [{ description: 'Webcam Full HD', quantity: 1, unitPrice: 279.9 }],
  },
  {
    orderNumber: 'PED-DEMO-005',
    deliveryForecast: new Date('2026-10-25T00:00:00.000Z'),
    deliveryAddress: 'Rua das Acácias, 45, Santos - SP',
    status: OrderStatus.PENDING,
    customer: {
      name: 'Pedro Almeida',
      document: '55555555555',
    },
    items: [{ description: 'SSD 1 TB', quantity: 1, unitPrice: 459.9 }],
  },
];

async function main() {
  const email = process.env.INITIAL_USER_EMAIL;
  const name = process.env.INITIAL_USER_NAME;
  const password = process.env.INITIAL_USER_PASSWORD;
  const connectionString = process.env.DATABASE_URL;

  if (!email || !name || !password || !connectionString) {
    throw new Error(
      'Configure INITIAL_USER_EMAIL, INITIAL_USER_NAME, INITIAL_USER_PASSWORD e DATABASE_URL no arquivo .env.',
    );
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
      where: { email },
      update: {
        name,
        passwordHash,
      },
      create: {
        name,
        email,
        passwordHash,
      },
    });

    await Promise.all(
      pedidos.map(async (pedido) => {
        const { customer, items, ...orderData } = pedido;

        const cliente = await prisma.customer.upsert({
          where: { document: customer.document },
          update: { name: customer.name },
          create: customer,
        });

        const pedidoExistente = await prisma.order.findFirst({
          where: {
            orderNumber: pedido.orderNumber,
          },
          select: {
            id: true,
          },
        });

        const dadosPedido = {
          ...orderData,
          customerId: cliente.id,
          deletedAt: null,
        };

        if (pedidoExistente) {
          await prisma.order.update({
            where: {
              id: pedidoExistente.id,
            },
            data: {
              ...dadosPedido,
              items: {
                deleteMany: {},
                create: items,
              },
            },
          });

          return;
        }

        await prisma.order.create({
          data: {
            ...dadosPedido,
            items: {
              create: items,
            },
          },
        });
      }),
    );

    console.log(`Usuário inicial configurado: ${email}`);
    console.log(`${pedidos.length} pedidos de demonstração configurados.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error('Erro ao executar o seed:', error);
  process.exitCode = 1;
});
