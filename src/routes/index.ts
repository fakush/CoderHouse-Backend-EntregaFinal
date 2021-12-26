import { Router } from 'express';
import authRouter from './routerJwtAuth';
import productsRouter from './routerProducts';
import imagesRouter from './routerProductImages';
import cartsRouter from './routerCarts';
import infoRouter from './routerInfo';
const router = Router();

router.use('/user', authRouter);
router.use('/products', productsRouter);
router.use('/images', imagesRouter);
router.use('/carts', cartsRouter);
router.use('/info', infoRouter);

export default router;
