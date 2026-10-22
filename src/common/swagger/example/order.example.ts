export const ORDER_REQUEST_EXAMPLES = {
  create: {
    summary: 'Criar pedido',
    value: {
      orderNumber: 'PED-TEST-001',
      deliveryForecast: '2026-11-15T12:00:00.000Z',
      customerName: 'João Silva',
      customerDocument: '12345678901',
      deliveryAddress: 'Rua das Flores, 123',
      status: 'PENDENTE',
      items: [
        {
          description: 'Notebook',
          quantity: 1,
          unitPrice: 3500.0,
        },
        {
          description: 'Mouse sem fio',
          quantity: 2,
          unitPrice: 89.9,
        },
      ],
    },
  },

  updateCustomer: {
    summary: 'Atualizar nome do cliente',
    value: {
      customerName: 'João Silva Santos',
    },
  },

  updateStatus: {
    summary: 'Atualizar status do pedido',
    value: {
      status: 'EM_ENTREGA',
    },
  },

  updateItems: {
    summary: 'Atualizar itens do pedido',
    value: {
      items: [
        {
          description: 'Notebook atualizado',
          quantity: 2,
          unitPrice: 3299.9,
        },
      ],
    },
  },
};
