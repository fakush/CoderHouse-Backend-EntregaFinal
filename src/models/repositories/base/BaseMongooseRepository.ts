import { IWrite } from '../interfaces/IWrite';
import { IRead } from '../interfaces/IRead';
import mongoose from 'mongoose';

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  public readonly model: any;

  constructor(db: string, schema: mongoose.Schema) {
    this.model = mongoose.model(db, schema);
  }

  async findById(id: string): Promise<T> {
    try {
      if (id) {
        return await this.model.findById(id);
      } else {
        throw new Error('Id is required');
      }
    } catch (error) {
      throw new Error('Error in findOne: ' + error);
    }
  }

  async find(item: T): Promise<T[]> {
    try {
      if (item) {
        return await this.model.findOne({ item });
      }
      return await this.model.find();
    } catch (error) {
      throw new Error('Error in find: ' + error);
    }
  }

  async add(item: T): Promise<boolean> {
    try {
      const newItem = new this.model(item);
      const result: mongoose.Document = await newItem.save();
      return !!result;
    } catch (error) {
      throw new Error('Error in add: ' + error);
    }
  }

  async update(id: string, item: T): Promise<boolean> {
    try {
      const result: mongoose.Document = await this.model.findByIdAndUpdate(id, item);
      return !!result;
    } catch (error) {
      throw new Error('Error in update: ' + error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result: mongoose.Document = await this.model.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error('Error in delete: ' + error);
    }
  }
}
