import { CartObject } from '../models/carts/carts.interface';
import { CartFactory, Persistencia } from '../models/carts/carts.factory';
import { authAPI } from './authAPI';
import { Logger } from '../utils/logger';

const tipo = Persistencia.Mongo;

class cartAPIClass {
  private cart;

  constructor() {
    this.cart = CartFactory.get(tipo);
  }

  async getCart(userId: string): Promise<CartObject> {
    return await this.cart.getCart(userId);
  }

  async createCart(userId: string): Promise<CartObject> {
    const user = await authAPI.findUser(userId);
    Logger.info(`Creating cart for user ${user.username}`);
    if (!user) throw new Error('User does not exist. Error creating cart');
    const newCart = await this.cart.createCart(userId, user.address);
    return newCart;
  }

  async add2Cart(cartId: string, productId: string, amount: number): Promise<CartObject> {
    Logger.debug(`Adding ${amount} of product ${productId} to cart ${cartId}`);
    const newProduct = { _id: productId, amount: amount };
    const updatedCart = await this.cart.add2Cart(cartId, newProduct);
    return updatedCart;
  }

  async deleteProduct(cartId: string, productId: string, amount: number) {
    Logger.debug(`Removing ${amount} of product ${productId} to cart ${cartId}`);
    const oldProduct = { _id: productId, amount: amount };
    const updatedCart = await this.cart.deleteProduct(cartId, oldProduct);
    return updatedCart;
  }

  async emptyCart(cartId: string): Promise<CartObject> {
    Logger.debug(`Emptying cart ${cartId}`);
    const updatedCart = await this.cart.emptyCart(cartId);
    return updatedCart;
  }
}

export const cartAPI = new cartAPIClass();
