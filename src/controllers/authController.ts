import { Request, Response, NextFunction } from 'express';
import { authAPI } from '../apis/authAPI';
import { userJoiSchema, UserObject } from '../models/users/users.interface';
import { generateAuthToken, checkAuth } from '../middlewares/auth';
import { Logger } from '../utils/logger';

//todo: is this needed?
interface RequestUser extends Request {
  user?: UserObject;
}
class authMiddleware {
  async checkValidUserAndPassword(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      return res.status(400).json({ msg: 'No data received' });
    }
    let { username, email, password } = req.body;
    const user = await authAPI.query(username, email);
    // Logger.debug('User: ' + user.username + ' exists.');
    if (!user) {
      Logger.info('User: ' + user.username + ' invalid.');
      return res.status(401).json({ msg: 'Invalid Username/Password' });
    }
    const validPassword = await authAPI.ValidatePassword(user.password, password);
    if (!validPassword) {
      Logger.info('User: ' + user.username + ' failed to login with valid password.');
      return res.status(401).json({ msg: 'Invalid Username/Password' });
    }
    next();
  }

  async checkExistingUser(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      return res.status(400).json({ msg: 'No data received' });
    }
    let { username, email } = req.body;
    const user = await authAPI.query(username, email);
    if (user) {
      Logger.info('User: ' + user.username + ' already exists.');
      return res.status(409).json({ msg: 'User already exists' });
    }
    next();
  }

  async login(req: Request, res: Response) {
    let { username, email } = req.body;
    const user = await authAPI.query(username, email);
    const token = await generateAuthToken(user);
    res.header('x-auth-token', token).status(200).json({
      msg: 'login OK',
      token
    });
  }

  async signup(req: Request, res: Response) {
    await userJoiSchema.validate(req.body);
    const newUser = await authAPI.signUpUser(req.body);
    const token = await generateAuthToken(newUser);
    res.header('x-auth-token', token).status(200).json({
      msg: 'signup OK',
      token
    });
  }

  async checkUserAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-auth-token'];
    if (!token) {
      Logger.debug('No token provided.');
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    const user = await checkAuth(token);
    if (!user) {
      Logger.debug('Invalid token.');
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    req.user = user;
    Logger.debug('User: ' + user.username + ' authorized.');
    // Logger.debug('Req.user: ' + req.user);
    next();
  }
}

export const controllerAuth = new authMiddleware();
