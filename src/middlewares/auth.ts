import Config from '../config';
import { Request, Response, NextFunction } from 'express';
import { UserObject } from '../models/users/users.interface';
import { authAPI } from '../apis/authAPI';
import { Logger } from '../utils/logger';

const jwt = require('jsonwebtoken');

type TokenPayload = { userId: string; userName: String; email: String; admin: boolean };

export const generateAuthToken = async (user: UserObject): Promise<string> => {
  const payload: TokenPayload = { userId: user._id, userName: user.username, email: user.email, admin: user.isAdmin };
  const token = await jwt.sign(payload, Config.TOKEN_SECRET_KEY, { expiresIn: '1h' });
  return token;
};

export const checkAuth = async (token: any) => {
  try {
    const decode: TokenPayload = await jwt.verify(token, Config.TOKEN_SECRET_KEY);
    Logger.debug('TOKEN DECODIFICADO');
    Logger.debug(decode);
    const user = await authAPI.findUser(decode.userId);
    return user;
  } catch (err) {
    Logger.error(err);
    return false;
  }
};
