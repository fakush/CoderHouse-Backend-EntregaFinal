import { Request, Response, NextFunction } from 'express';
import { cartAPI } from '../apis/cartsAPI';
import { Logger } from '../utils/logger';

class Cart {
  async lookForId(req: Request, res: Response, next: NextFunction) {
    // Si el id no existe, se manda un error 404
    const id = req.params.id;
    if (!id) return res.status(400).json({ msg: 'missing parameters' });
    next();
  }

  async getCart(req: Request, res: Response) {
    const userId = req.params.id;
    const cart = await cartAPI.getCart(userId);
    if (!cart) res.status(401).json({ msg: `cart not found` });
    return res.json({ data: cart });
  }

  async add2Cart(req: Request, res: Response) {
    const cartId = req.params.id;
    const { product, amount } = req.body;
    Logger.debug(`Adding product ${product} to cart ${cartId} with amount ${amount}`);
    const updatedCart = await cartAPI.add2Cart(cartId, product, amount);
    return res.json(updatedCart);
  }

  async deleteProducts(req: Request, res: Response) {
    const cartId = req.params.id;
    const { product, amount } = req.body;
    const updatedCart = await cartAPI.deleteProduct(cartId, product, amount);
    return res.json(updatedCart);
  }
}

export const cartController = new Cart();
