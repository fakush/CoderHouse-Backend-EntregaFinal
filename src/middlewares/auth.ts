import Config from '../config';
import { Request, Response, NextFunction } from 'express';
import { UserObject } from '../models/users/users.interface';
import { authAPI } from '../apis/authApi';
import { Logger } from '../utils/logger';

const jwt = require('jsonwebtoken');

interface RequestUser extends Request {
  user?: UserObject;
}

type TokenPayload = { userId: string; userName: String; email: String };

export const generateAuthToken = async (user: UserObject): Promise<string> => {
  const payload: TokenPayload = { userId: user._id, userName: user.username, email: user.email };
  const token = await jwt.sign(payload, Config.TOKEN_SECRET_KEY, { expiresIn: '1h' });
  return token;
};

export const checkAuth = async (req: RequestUser, res: Response, next: NextFunction) => {
  //get the token from the header if present
  const token = req.headers['x-auth-token'];
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });
  try {
    const decode: TokenPayload = await jwt.verify(token, Config.TOKEN_SECRET_KEY);
    Logger.debug('TOKEN DECODIFICADO');
    Logger.debug(decode);
    const user = await authAPI.findUser(decode.userId);
    if (!user) return res.status(400).json({ msg: 'Unauthorized' });
    req.user = user;
    next();
  } catch (err) {
    Logger.error(err);
    return res.status(401).json({ msg: 'Unauthorized' });
  }
};
