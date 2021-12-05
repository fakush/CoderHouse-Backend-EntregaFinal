import { NextFunction, Request, Response } from 'express';

const admin = true;

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  //todo: check if user is admin

  if (admin) next();
  else {
    res.status(401).json({
      msg: 'No estas autorizado'
    });
  }
};
