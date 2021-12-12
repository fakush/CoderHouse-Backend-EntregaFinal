import { Router } from 'express';
import authRouter from './routerJwtAuth';
import productsRouter from './routerProducts';
const router = Router();

router.use('/user', authRouter);
router.use('/products', productsRouter);

export default router;
