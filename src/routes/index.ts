import { Router } from 'express';
import routerAuth from './routerAuth';
const router = Router();

router.use('/user', routerAuth);

export default router;
