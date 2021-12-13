import { Schema } from 'mongoose';

export type productReference = Schema.Types.ObjectId | string;
export interface CartObject {
  userId: string;
  products: ProductObject[];
}

export interface ProductObject {
  _id: string;
  amount: number;
}

export interface CartBaseClass {
  getCart(userId?: string): Promise<CartObject>;
  createCart(userId: string): Promise<CartObject>;
  add2Cart(cartId: string, product: ProductObject): Promise<CartObject>;
  deleteProduct(cartId: string, product: ProductObject): Promise<CartObject>;
  emptyCart(cartId: string): Promise<CartObject>;
}
