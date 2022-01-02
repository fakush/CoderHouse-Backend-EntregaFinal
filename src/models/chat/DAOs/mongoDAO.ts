import mongoose from 'mongoose';
import { ChatBaseClass, chatObject } from '../chat.interfaces';

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
    this.chatLog = messageModel;
  }

  async getChatLog(userId: string): Promise<chatObject[]> {
    const chatLog = await this.chatLog.find({ userId });
    if (!chatLog) throw new Error('No se encontraron mensajes');
    return chatLog;
  }

  async addChatMessage(userId: string, type: string, message: string, timestamp: string): Promise<chatObject> {
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
