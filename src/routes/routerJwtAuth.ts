import { Router } from 'express';
import { controllerAuth } from '../middlewares/controllerAuth';
import { isAdmin } from '../middlewares/isAdmin';
import asyncHandler from 'express-async-handler';

const router = Router();

router.post('/login', controllerAuth.checkValidUserAndPassword, asyncHandler(controllerAuth.login));

router.post('/signup', controllerAuth.checkExistingUser, asyncHandler(controllerAuth.signup));

router.get('/secure-data', controllerAuth.checkUserAuth, (req, res) => {
  res.json({ msg: 'Llegaste a la data segura' });
});

router.post('/logout', (req: any, res) => {
  req.session.destroy;
  res.status(200).json({ msg: 'Cerramos la sesion' });
});

export default router;
