import mongoose, { Schema } from 'mongoose';
import { OrderObject, OrderBaseClass } from '../orders.interface';
import { MongoDB } from '../../../services/mongodb';
import { Logger } from '../../../utils/logger';

//MongoSchema
const orderSchema = new mongoose.Schema<OrderObject>({
  userId: { type: Schema.Types.ObjectId, required: true },
  products: [{ _id: Schema.Types.ObjectId, amount: Number }]
});

const dbCollection = 'orders';

export class PersistenciaMongo implements OrderBaseClass {
  private orders;

  constructor() {
    const mongo = new MongoDB();
    const server = mongo.getConnection();
    this.orders = server.model<OrderObject>(dbCollection, orderSchema);
  }

  async find(id: string): Promise<Boolean> {
    const item: any = await this.orders.findOne({ id });
    if (item == 0) return false;
    return true;
  }

  async getOrders(userId: string): Promise<OrderObject> {
    const item = await this.orders.findOne({ userId });
    if (!item) throw new Error('No existe orden del usuario');
    return item;
  }

  async createOrder(userId: string, products: object[]): Promise<OrderObject> {
    const newOrder = new this.orders({ userId, products });
    await newOrder.save();
    return newOrder;
  }

  async deleteOrder(userId: string): Promise<OrderObject> {
    const item = await this.orders.findByIdAndDelete(userId);
    if (!item) throw new Error('No existe orden del usuario');
    return item;
  }
}
