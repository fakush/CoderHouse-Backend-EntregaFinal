import Joi from 'joi';

const PASS_RE = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const userJoiSchema = Joi.object({
  firstName: Joi.string().min(3).max(15).required(),
  lastName: Joi.string().min(4).max(20).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(5).max(20).required(),
  password: Joi.string().regex(PASS_RE).required(),
  address: Joi.string().min(5).max(50).required(),
  phone: Joi.string().min(5).max(15).required(),
  age: Joi.number().integer().min(3).max(110).required(),
  isAdmin: Joi.boolean().required()
});

export interface newUserObject {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  age: number;
  isAdmin: boolean;
  timestamp: string;
}

export interface UserObject {
  _id?: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  age: number;
  isAdmin: boolean;
  timestamp: string;
}

export interface UserQuery {
  username?: string;
  email?: string;
}

export interface UserBaseClass {
  login(data: newUserObject): Promise<UserObject>;
  signUp(data: newUserObject): Promise<UserObject>;
}
