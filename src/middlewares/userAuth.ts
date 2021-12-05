import passport from 'passport';
import { Strategy, VerifyFunctionWithRequest, IStrategyOptionsWithRequest } from 'passport-local';
import { Request, Response, NextFunction } from 'express';
import { authAPI } from '../apis/authApi';
import { userJoiSchema } from '../models/users/users.interface';
import { Logger } from '../services/logger';

const strategyOptions: IStrategyOptionsWithRequest = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
};

const loginFunc: VerifyFunctionWithRequest = async (req, username, password, done) => {
  const user = await authAPI.query(username);

  if (!user) {
    Logger.warn(`Login Fail for username ${username}: User does not exist`);
    return done(null, false, { message: 'User does not exist' });
  }

  const check = await authAPI.ValidatePassword(username, password);

  if (!check) {
    Logger.warn('Login Fail for username ${username}: Password is not valid');
    return done(null, false, { message: 'Password is not valid.' });
  }

  Logger.info(`User ${username} logged in at ${new Date()}`);
  // Logger.debug(`User: ${user}`);
  return done(null, user);
};

const signUpFunc: VerifyFunctionWithRequest = async (req, username, password, done) => {
  Logger.info(`SignUp for username ${username} at ${new Date()}`);
  try {
    await userJoiSchema.validateAsync(req.body);

    const { email } = req.body;
    const user = await authAPI.query(username, email);

    if (user) {
      Logger.warn(`Signup Fail for username ${username}: Username or email already exists`);
      return done(null, { error: `Invalid Username/email` });
    } else {
      const newUser = await authAPI.signUpUser(req.body);
      return done(null, newUser);
    }
  } catch (err) {
    if (err instanceof Error) {
      Logger.error(err.message);
      return done(null, {
        error: err.message
      });
    }
  }
};

passport.use('login', new Strategy(strategyOptions, loginFunc));
passport.use('signup', new Strategy(strategyOptions, signUpFunc));

passport.serializeUser((user: any, done) => {
  Logger.debug(`Serialize user: ${user}`);
  done(null, user._id);
});

passport.deserializeUser(async (userId: string, done) => {
  Logger.debug(`Deserialize user: ${userId}`);
  try {
    const result = await authAPI.findUser(userId);
    done(null, result[0]);
  } catch (err) {
    done(err);
  }
});

export const isLoggedIn = (req: Request, res: Response, done: NextFunction) => {
  if (!req.user) return res.status(401).json({ msg: 'Unathorized' });

  done();
};

export const isAdmin = (req: Request, res: Response, done: NextFunction) => {
  if (!req.user) return res.status(401).json({ msg: 'Unathorized' });

  done();
};

export default passport;
