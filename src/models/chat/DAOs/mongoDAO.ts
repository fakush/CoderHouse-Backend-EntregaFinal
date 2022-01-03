import mongoose from 'mongoose';
import { Logger } from '../../../utils/logger';
import { ChatBaseClass, chatObject } from '../chat.interfaces';
import { MongoDB } from '../../../services/mongodb';

//MongoSchema
const dbCollection = 'chatLogs';
const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, required: true }
});

export const messageModel = mongoose.model(dbCollection, messageSchema);

export class PersistenciaMongo implements ChatBaseClass {
  private chatLog;

  constructor() {
    const mongo = new MongoDB();
    const server = mongo.getConnection();
    this.chatLog = server.model<chatObject>(dbCollection, messageSchema);
  }

  async getChatLog(userId: string): Promise<chatObject[]> {
    const chatLog = await this.chatLog.find({ userId });
    if (!chatLog) throw new Error('No se encontraron mensajes');
    return chatLog;
  }

  async addChatMessage(userId: string, type: string, message: string, timestamp: string): Promise<chatObject> {
    // Logger.debug(`Mensaje recibido: ${JSON.stringify({ userId, type, message, timestamp })}`);
    const chatLog = new this.chatLog({
      userId,
      type,
      message,
      timestamp
    });
    const result = await chatLog.save();
    if (!result) throw new Error('No se pudo guardar el mensaje');
    return result;
  }
}
