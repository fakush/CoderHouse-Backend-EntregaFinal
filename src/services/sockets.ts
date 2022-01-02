import { Server } from 'socket.io';
import moment from 'moment';
import { Logger } from '../utils/logger';
import { chatAPI } from '../apis/chatAPI';
import { checkAuth } from '../middlewares/auth';
import { UserObject } from '../models/users/users.interface';
import { chatBot } from '../middlewares/chatBot';

const initWsServer = (server: any) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    Logger.info('Conexion por sockets establecida');

    let user: UserObject = {} as UserObject;

    socket.on('token', async (data) => {
      const { token } = data.token;
      user = (await checkAuth(token)) as UserObject;
      const chatLog = await chatAPI.getChatLog(user._id);
      socket.emit('chatLog', chatLog);
    });

    socket.on('new-message', async (messageData) => {
      const newMessage = {
        UserId: user._id,
        from: 'User',
        message: messageData.message,
        date: moment().format('DD/MM/YYYY HH:mm:ss')
      };
      await chatAPI.addChatMessage(newMessage.UserId, newMessage.from, newMessage.message, newMessage.date);
      socket.emit('chatLog', newMessage);
      const response = await chatBot(user._id, newMessage);
      await chatAPI.addChatMessage(response.UserId, response.from, response.message, response.date);
      socket.emit('chatLog', response);
    });
  });

  return io;
};

export default initWsServer;
