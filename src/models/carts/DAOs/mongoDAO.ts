import mongoose, { Schema } from 'mongoose';
import { CartObject, CartBaseClass, ProductObject } from '../carts.interface';
import { MongoDB } from '../../../services/mongodb';
import { Logger } from '../../../utils/logger';

//MongoSchema
const cartSchema = new mongoose.Schema<CartObject>({
  userId: { type: String, required: true, unique: true },
  products: [{ _id: Schema.Types.ObjectId, amount: Number }]
});

const dbCollection = 'carts';
export class PersistenciaMongo implements CartBaseClass {
  private carrito;

  constructor() {
    const mongo = new MongoDB();
    const server = mongo.getConnection();
    this.carrito = server.model<CartObject>(dbCollection, cartSchema);
  }

  async find(id: string): Promise<Boolean> {
    const item: any = await this.carrito.findById(id);
    if (item == 0) return false;
    return true;
  }

  async getCart(userId: string): Promise<CartObject> {
    const item = await this.carrito.findOne({ userId });
    if (!item) throw new Error('No existe el carrito');
    return item;
  }

  async createCart(userId: string): Promise<CartObject> {
    const newCart = new this.carrito({ userId, products: [] });
    await newCart.save();
    return newCart;
  }

  productExist(cart: CartObject, productId: string): boolean {
    const index = cart.products.findIndex((aProduct) => aProduct._id == productId);
    if (index < 0) return false;
    return true;
  }

  async add2Cart(cartId: string, product: ProductObject): Promise<CartObject> {
    Logger.debug('add2Cart');
    Logger.debug(product);
    const cart = await this.carrito.findOne({ cartId });
    if (!cart) throw new Error('Cart not found');
    const index = cart.products.findIndex((aProduct: any) => aProduct._id == product._id);
    if (index < 0) cart.products.push(product);
    else cart.products[index].amount += product.amount;
    await cart.save();
    return cart;
  }

  async deleteProduct(cartId: string, product: ProductObject): Promise<CartObject> {
    const cart = await this.carrito.findOne({ cartId });
    if (!cart) throw new Error('Cart not found');
    const index = cart.products.findIndex((aProduct) => aProduct._id == product._id);
    if (index < 0) throw new Error('Product not found');
    if (cart.products[index].amount <= product.amount) cart.products.splice(index, 1);
    else cart.products[index].amount -= product.amount;
    await cart.save();
    return cart;
  }

  async emptyCart(cartId: string): Promise<CartObject> {
    const cart = await this.carrito.findOne({ cartId });
    if (!cart) throw new Error('Cart not found');
    cart.products = [];
    await cart.save();
    return cart;
  }
}
