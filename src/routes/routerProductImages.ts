import { Router } from 'express';
import { productsController } from '../controllers/productsController';
import { imageController } from '../controllers/imageController';
import { imageMiddleware } from '../middlewares/imageMiddleware';
import { controllerAuth } from '../controllers/authController';
import { isAdmin } from '../middlewares/isAdmin';
import multer from 'multer';
import asyncHandler from 'express-async-handler';

const router = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.cwd() + '/assets/images')},
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, //! limite 5MB
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
});

router.get('/:id', productsController.checkValidId, asyncHandler(imageController.getImages as any));
router.post(
  '/:id',
  controllerAuth.checkUserAuth,
  isAdmin,
  productsController.checkValidId,
  upload.single('image'),
  asyncHandler(imageMiddleware.uploadImage as any), 
  asyncHandler(imageController.uploadImage as any)
);
router.delete(
  '/:id',
  controllerAuth.checkUserAuth,
  isAdmin,
  productsController.checkValidId,
  asyncHandler(imageMiddleware.deleteImage as any),
    (req: any, res: any) => {
        res.status(200).json({
            msg: 'Imagen eliminada correctamente'
        });
    }
);

export default router;
