import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { newUserObject, UserObject, UserBaseClass } from '../users.interface';
import { Logger } from '../../../services/logger';
import { MongoDB } from '../../../services/mongodb';
import moment from 'moment';

const Schema = mongoose.Schema;
const dbCollection = 'users';

const UserSchema = new Schema<UserObject>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  isAdmin: { type: Boolean, required: true },
  timestamp: { type: String, required: true }
});

UserSchema.pre('save', async function (next) {
  const user = this;
  const hash = await bcrypt.hash(user.password, 10);

  this.password = hash;
  next();
});

// ToDo: Delete this after testing
// UserSchema.methods.isValidPassword = async function (password) {
//   const user = this;
//   const compare = await bcrypt.compare(password, user.password);
//   return compare;
// };

// Exporto el modelo para tests
export const Users = mongoose.model<UserObject>(dbCollection, UserSchema);
export class PersistenciaMongo implements UserBaseClass {
  private server: string;
  private users;
  private password: string;

  constructor() {
    const mongo = new MongoDB();
    const server = mongo.getConnection();
    this.users = server.model<UserObject>(dbCollection, UserSchema);
  }

  async query(query: any): Promise<UserObject> {
    // Logger.debug('PersistenciaMongo.query()');
    const result = await this.users.find(query);
    // Logger.debug(result);
    return result[0];
  }

  async findUser(userId: string): Promise<UserObject> {
    const user = await this.users.findById(userId);
    return user;
  }

  async login(data: newUserObject): Promise<UserObject> {
    const finder = data.username;
    const user = await this.users.findOne({ finder });
    return user;
  }

  async signUp(data: newUserObject): Promise<UserObject> {
    const addUser: UserObject = {
      username: data.username,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phone: data.phone,
      age: data.age,
      isAdmin: false,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    Logger.debug('PersistenciaMongo.signUp() ==> ' + JSON.stringify(addUser));
    const newUser = new this.users(addUser);
    await newUser.save();
    return newUser;
  }

  async validateUserPassword(username: string, password: string): Promise<boolean> {
    const user = await this.users.findOne({ username });
    if (!user) return false;
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) return false;
    return true;
  }
}
