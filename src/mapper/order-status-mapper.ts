import { OrderStatus } from '../generated/prisma/enums';
import { OrderStatusEnum } from '../orders/enum/order-status-api.enum';

export const ORDER_STATUS_TO_API: Record<OrderStatus, OrderStatusEnum> = {
  [OrderStatus.PENDING]: OrderStatusEnum.PENDENTE,
  [OrderStatus.IN_DELIVERY]: OrderStatusEnum.EM_ENTREGA,
  [OrderStatus.DELIVERED]: OrderStatusEnum.ENTREGUE,
  [OrderStatus.CANCELED]: OrderStatusEnum.CANCELADO,
};

export const API_TO_ORDER_STATUS: Record<OrderStatusEnum, OrderStatus> = {
  [OrderStatusEnum.PENDENTE]: OrderStatus.PENDING,
  [OrderStatusEnum.EM_ENTREGA]: OrderStatus.IN_DELIVERY,
  [OrderStatusEnum.ENTREGUE]: OrderStatus.DELIVERED,
  [OrderStatusEnum.CANCELADO]: OrderStatus.CANCELED,
};