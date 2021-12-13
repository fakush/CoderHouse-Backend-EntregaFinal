import { OrderObject } from '../models/orders/orders.interface';
import { OrderFactory, Persistencia } from '../models/orders/orders.factory';
import { cartAPI } from './cartsAPI';
import { Logger } from '../utils/logger';
import { PersistenceArgument } from '../config/arguments';

//Si hay un argumento de persistencia, lo uso, sino, uso el default.
const tipo = PersistenceArgument || Persistencia.Mongo;

class OrderAPIClass {
  private order;

  constructor() {
    this.order = OrderFactory.get(tipo);
  }

  async findOrder(orderId: string) {
    return await this.order.find(orderId);
  }

  async getOrders(userId: string): Promise<OrderObject> {
    return await this.order.getOrders(userId);
  }

  async createOrder(userId: string): Promise<OrderObject> {
    const cart = await cartAPI.getCart(userId);
    Logger.debug(`Creating order for cart ${cartAPI}`);
    if (!cart) throw new Error('Cart does not exist. Error creating order');
    const newOrder = await this.order.createOrder(userId, cart.products);
    return newOrder;
  }

  async deleteProduct(orderId: string) {
    return await this.order.deleteOrder(orderId);
  }
}

export const orderAPI = new OrderAPIClass();
