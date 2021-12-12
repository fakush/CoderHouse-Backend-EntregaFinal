import { Router } from 'express';
import routerAuth from './routerJwtAuth';
const router = Router();

router.use('/user', routerAuth);

export default router;
