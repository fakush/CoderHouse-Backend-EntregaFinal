import { Router } from 'express';
import { controllerAuth } from '../middlewares/controllerAuth';
import asyncHandler from 'express-async-handler';

const router = Router();

router.post('/login', controllerAuth.checkValidUserAndPassword, asyncHandler(controllerAuth.login));

router.post('/signup', controllerAuth.checkExistingUser, asyncHandler(controllerAuth.signup));

router.post('/logout', (req: any, res) => {
  req.session.destroy;
  res.status(200).json({ msg: 'Cerramos la sesion' });
});

export default router;
