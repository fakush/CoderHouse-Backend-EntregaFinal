import { Request, Response, NextFunction } from 'express';
import { cartAPI } from '../apis/cartsAPI';
import { orderAPI } from '../apis/ordersAPI';
import { authAPI } from '../apis/authAPI';
import { EmailService } from '../services/mailer';
import { Logger } from '../utils/logger';
import config from '../config';

class Orders {
  async lookForId(req: Request, res: Response, next: NextFunction) {
    // Si el id no existe, se manda un error 404
    const id = req.params.id;
    if (!id) return res.status(400).json({ msg: 'missing parameters' });
    next();
  }

  async getOrders(req: Request, res: Response) {
    const userId = req.params.id;
    const cart = await orderAPI.getOrders(userId);
    if (!cart) res.status(401).json({ msg: `Order not found` });
    return res.json({ data: cart });
  }

  async createOrder(req: Request, res: Response) {
    const cartId = req.params.id;
    const userData = await authAPI.findUser(cartId);
    Logger.debug(`Creating Order`);
    const newOrder = await orderAPI.createOrder(cartId);
    await cartAPI.emptyCart(cartId);
    // Enviando Email de notificación al administrador - OK
    EmailService.sendEmail(
      config.ETHEREAL_EMAIL,
      `Nuevo pedido de: ${userData.username} - ${userData.email}`,
      `Nuevo pedido: ${newOrder.products}`
    );
  }
}

export const controllerOrders = new Orders();
