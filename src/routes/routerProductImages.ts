import { Router } from 'express';
import { productsController } from '../controllers/productsController';
import { imageController } from '../controllers/imageController';
import { imageMiddleware } from '../middlewares/imageMiddleware';
import { authController } from '../controllers/authController';
import { isAdmin } from '../middlewares/isAdmin';
import multer from 'multer';
import asyncHandler from 'express-async-handler';

const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + '/assets/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
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

/**
 * @swagger
 * /api/images/:id:
 *   get:
 *     summary: Returns an array of images
 *     tags:
 *       - Images
 *     parameters:
 *       - in: path
 *         id: Product ID
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the product
 *     responses:
 *       200:
 *         description: Returns array of images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 images:
 *                     $ref: '#/components/schemas/ImageArray'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/400BadRequest'
 */
router.get('/:id', productsController.checkValidId, asyncHandler(imageController.getImages as any));

/**
 * @swagger
 * /api/images/upload/:id:
 *   post:
 *     summary: Returns an array of images
 *     tags:
 *       - Images
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/x-auth-token'
 *       - in: path
 *         id: Product ID
 *         schema:
 *           type: string
 *           required: true
 *           description: Id of the product
 *           example: 61b6871a6238063410299fc6
 *       - in: body
 *         name: file
 *         schema:
 *           $ref: '#/components/schemas/NewImageInput'
 *     responses:
 *       200:
 *         description: Returns array of images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image uploaded
 *                 data:
 *                   $ref: '#/components/schemas/ImageArray'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/400BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/401Unauthorized'
 */
router.post(
  '/upload/:id',
  authController.checkUserAuth,
  isAdmin,
  productsController.checkValidId,
  upload.single('file'),
  asyncHandler(imageMiddleware.uploadImage as any),
  asyncHandler(imageController.uploadImage as any)
);

/**
 * @swagger
 * /api/images/:id:
 *   delete:
 *     summary: Returns an array of images
 *     tags:
 *       - Images
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/x-auth-token'
 *       - in: path
 *         id: Product ID
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the product
 *       - in: body
 *         name: image
 *         schema:
 *           type: object
 *           properties:
 *             image:
 *               type: string
 *               description: Image url
 *               example: https://res.cloudinary.com/caffeine-apps/image/upload/v1639966361/tefktngz6x5rdm6m4kui.jpg
 *     responses:
 *       200:
 *         description: Returns Message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image deleted
 *                 data:
 *                   $ref: '#/components/schemas/ImageArray'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/400BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/401Unauthorized'
 */
router.delete(
  '/:id',
  authController.checkUserAuth,
  isAdmin,
  productsController.checkValidId,
  asyncHandler(imageMiddleware.deleteImage as any),
  asyncHandler(imageController.deleteImage as any),
  (req: any, res: any) => {
    res.status(200).json({
      msg: 'Imagen eliminada correctamente'
    });
  }
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ImageData:
 *       type: array
 *       items:
 *         type: url
 *         format: string
 *         example: https://res.cloudinary.com/caffeine-apps/image/upload/v1639966361/tefktngz6x5rdm6m4kui.jpg
 *     NewImageInput:
 *       type: formData
 *       properties:
 *         image:
 *           type: file
 *           description: Image to upload
 *           example: tefktngz6x5rdm6m4kui.jpg
 *     ImageArray:
 *       type: array
 *       items:
 *         type: url
 *         format: string
 *         example: https://res.cloudinary.com/caffeine-apps/image/upload/v1639966361/tefktngz6x5rdm6m4kui.jpg, https://res.cloudinary.com/caffeine-apps/image/upload/v1639966361/tefktngz6x5rdm6m4kui.jpg, https://res.cloudinary.com/caffeine-apps/image/upload/v1639966361/tefktngz6x5rdm6m4kui.jpg
 *     x-auth-token:
 *         type: string
 *         required: true
 *         description: JWT Bearer token
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWQwODMxNDE4ZjAxZDRlOWExMDE5MTIiLCJ1c2VyTmFtZSI6Ik1yQnVybnMiLCJlbWFpbCI6ImJ1cm5zQHNwcmluZ2ZpZWxkLmNvbSIsImFkbWluIjpmYWxzZSwiaWF0IjoxNjQxMDYzNDYyLCJleHAiOjE2NDEwNzA2NjJ9.SzXkleGE1qkqLCeKRrAowGI2ZCaHX_IhCdToWyHOibc"
 */
