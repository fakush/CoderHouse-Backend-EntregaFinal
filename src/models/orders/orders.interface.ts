import { Schema } from 'mongoose';

export type userReference = Schema.Types.ObjectId | string;

export interface OrderObject {
  userId: userReference;
  products: object[];
}

export interface OrderBaseClass {
  getOrders(userId?: string): Promise<OrderObject>;
  createOrder(userId: string, products: object[]): Promise<OrderObject>;
  deleteOrder(userId: string): Promise<OrderObject>;
}
