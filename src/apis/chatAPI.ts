import { ChatFactory, Persistencia } from '../models/chat/chat.factory';
import { chatObject } from '../models/chat/chat.interfaces';

const tipo = Persistencia.Mongo;

class chatApiClass {
  private chatLog;

  constructor() {
    this.chatLog = ChatFactory.get(tipo);
  }

  async getChatLog(userId: string): Promise<chatObject[]> {
    const chatLog = await this.chatLog.getChatLog(userId);
    if (!chatLog) throw new Error('No se encontraron mensajes');
    return chatLog;
  }

  async addChatMessage(userId: string, type: string, message: string, timestamp: string): Promise<chatObject> {
    const chatLog = await this.chatLog.addChatMessage(userId, type, message, timestamp);
    if (!chatLog) throw new Error('No se pudo guardar el mensaje');
    return chatLog;
  }
}

export const chatAPI = new chatApiClass();
