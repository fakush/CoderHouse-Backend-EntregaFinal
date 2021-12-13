import { Router } from 'express';
import authRouter from './routerJwtAuth';
import productsRouter from './routerProducts';
import cartsRouter from './routerCarts';
const router = Router();

router.use('/user', authRouter);
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);

export default router;
