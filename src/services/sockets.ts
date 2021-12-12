import { Server } from 'socket.io';
import moment from 'moment';
import { Logger } from '../utils/logger';
// import { productsAPI } from '../apis/productsAPI';
// import { chatAPI } from '../apis/chatAPI';
// import faker from 'faker';
// import { SmsService } from './sms';

const initWsServer = (server: any) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    Logger.info('Nueva Conexion establecida');

    // Lógica Lista Productos
    socket.on('askData', () => {
      //   productsAPI.getProducts().then((result) => socket.emit('productMessages', result));
      //   chatAPI.getChatMessages().then((result) => socket.emit('chatLog-messages', result));
    });

    socket.on('new-product-message', (productData) => {
      const newProduct = {
        id: 0,
        timestamp: moment().format('DD-MM-YYYY h:mm a'),
        nombre: productData.nombre,
        descripcion: productData.descripcion || 'Sin descripción',
        codigo: productData.codigo,
        foto: productData.foto || 'https://picsum.photos/200',
        precio: productData.precio,
        stock: productData.stock
      };
      //   productsAPI
      //     .addProduct(newProduct)
      //     .then(() => productsAPI.getProducts())
      //     .then((data) => io.emit('productMessages', data));
    });

    socket.on('chatMessage', (msg) => {
      const newChatEntry = {
        email: msg.email,
        nombre: msg.nombre,
        apellido: msg.apellido,
        edad: msg.edad,
        alias: msg.alias,
        avatar: msg.avatar,
        message: msg.mensaje,
        timestamp: moment().format()
      };
      const newChatLine = {
        avatar: msg.avatar,
        nombre: msg.nombre,
        apellido: msg.apellido,
        email: msg.email,
        mensaje: msg.mensaje
      };
      // Logger.info(newChatLine);
      if (newChatEntry.message.toLowerCase().includes('administrador')) {
        const smsMessage = `Mensaje de: ${newChatEntry.email}; con el contenido: ${newChatEntry.message}`;
        // SmsService.sendMessage('+541134803233', smsMessage);
        Logger.info(`Enviando mensaje SMS: ${smsMessage}`);
      }
      io.emit('chat-message', newChatLine);
      //   chatAPI.addChatLine(newChatEntry);
    });
  });

  return io;
};

export default initWsServer;
