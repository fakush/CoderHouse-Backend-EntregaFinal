import { productsAPI } from '../apis/productsAPI';
import { orderAPI } from '../apis/ordersAPI';
import { cartAPI } from '../apis/cartsAPI';
import { ProductObject } from '../models/products/products.interface';
import moment from 'moment';

export const chatBot = (userId: string, chabotMessage: any) => {
  const message = chabotMessage.message;

  let newMessage = {
    UserId: userId,
    from: 'System',
    message: '',
    date: moment().format('DD/MM/YYYY HH:mm:ss')
  };

  const getStock = async () => {
    const products = productsAPI.getProducts();
    const stock = (await products).map((product: ProductObject) => {
      product.name, product.stock;
    });
    newMessage.message = `Stock: ${JSON.stringify(stock)}`;
    return newMessage;
  };

  const getLastOrder = async () => {
    const orders = orderAPI.getOrders(userId);
    const lastOrder = (await orders).pop();
    newMessage.message = `Ultima orden: ${JSON.stringify(lastOrder)}`;
    return newMessage;
  };

  const getCart = async () => {
    const cart = await cartAPI.getCart(userId);
    newMessage.message = `Carrito: ${JSON.stringify(cart)}`;
    return newMessage;
  };

  const getDefaultMessage = async () => {
    newMessage.message =
      '--------------------------------------------------------------------------------\n' +
      '| To get a proper response please enter one of the following options:          |\n' +
      '|     * Stock: To get a list of all our products stock                         |\n' +
      '|     * Order: To get your last order                                          |\n' +
      '|     * Cart: To get your current cart content                                 |\n' +
      '--------------------------------------------------------------------------------\n';
    return newMessage;
  };

  switch (message) {
    case message.toLowerCase().includes('stock'):
      return getStock();
    case message.toLowerCase().includes('order'):
      return getLastOrder();
    case message.toLowerCase().includes('cart'):
      return getCart();
    case message.toLowerCase().includes('help'):
      return getDefaultMessage();
    default:
      return getDefaultMessage();
  }
};
