import { newUserObject, UserObject, UserQuery } from '../models/users/users.interface';
import { UsersFactory, Persistencia } from '../models/users/users.factory';
import { Logger } from '../utils/logger';
import { cartAPI } from './cartsAPI';

const tipo = Persistencia.Mongo;

class authAPIClass {
  private auth;

  constructor() {
    this.auth = UsersFactory.get(tipo);
  }

  userModel() {
    return this.auth.model();
  }

  async query(username?: string, email?: string): Promise<UserObject> {
    const query = { $or: [] as UserQuery[] };
    if (username) query.$or.push({ username });
    if (email) query.$or.push({ email });
    return this.auth.query(query);
  }

  async findUser(userId?: string): Promise<UserObject> {
    return await this.auth.findUser(userId);
  }

  async loginUser(data: newUserObject): Promise<UserObject> {
    return await this.auth.login(data);
  }

  async signUpUser(data: newUserObject): Promise<UserObject> {
    const newUser = await this.auth.signUp(data);
    await cartAPI.createCart(newUser._id);
    return newUser;
  }

  async ValidatePassword(dbPassword: string, password: string) {
    return this.auth.validateUserPassword(dbPassword, password);
  }
}

export const authAPI = new authAPIClass();
