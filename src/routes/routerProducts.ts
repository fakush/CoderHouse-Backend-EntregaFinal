import { Router } from 'express';
import { productsController } from '../controllers/productsController';
import { controllerAuth } from '../controllers/authController';
import { isAdmin } from '../middlewares/isAdmin';
import asyncHandler from 'express-async-handler';

const router = Router();

/**
 * @swagger
 * /api/products/:
 *   get:
 *     summary: Retuns all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Returns array of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  $ref: '#/components/schemas/ProductData'
 *       400:
 *         description: Error getting products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.get('/', asyncHandler(productsController.getProducts as any));

/**
 * @swagger
 * /api/products/:id:
 *   get:
 *     summary: Returns a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         id: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: product ID
 *     responses:
 *       200:
 *         description: get product data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  $ref: '#/components/schemas/ProductData'
 *       400:
 *         description: Error getting product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.get('/:id', productsController.checkValidId, asyncHandler(productsController.getProducts as any));

/**
 * @swagger
 * /api/products/:
 *   post:
 *     summary: Creates a new product
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProductInput'
 *     responses:
 *       200:
 *         description: Returns created product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  msg: 'creando productos'
 *                  $ref: '#/components/schemas/ProductData'
 *       400:
 *         description: "Falta ingresar alguno de los campos obligatorios: Nombre, Precio y Stock"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.post(
  '/',
  controllerAuth.checkUserAuth,
  isAdmin,
  productsController.checkValidProduct,
  asyncHandler(productsController.addProducts as any)
);

/**
 * @swagger
 * /api/products/:id:
 *   put:
 *     summary: Updates a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         id: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProductInput'
 *     responses:
 *       200:
 *         description: Returns updated product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  msg: 'actualizando productos'
 *                  $ref: '#/components/schemas/ProductData'
 *       400:
 *         description: "Falta ingresar alguno de los campos obligatorios: Nombre, Precio y Stock"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.put(
  '/:id?',
  controllerAuth.checkUserAuth,
  isAdmin,
  productsController.checkValidId,
  productsController.checkValidProduct,
  asyncHandler(productsController.updateProducts)
);

/**
 * @swagger
 * /api/products/:id:
 *   delete:
 *     summary: Deletes a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         id: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Devuelve la lista de productos actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  msg: 'borrando productos'
 *                  $ref: '#/components/schemas/ProductData'
 *       400:
 *         description: "Falta el id del producto"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.delete(
  '/:id?',
  controllerAuth.checkUserAuth,
  isAdmin,
  productsController.checkValidId,
  asyncHandler(productsController.deleteProducts as any)
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductData:
 *       type: object
 *       properties:
 *         _id:
 *           type: String
 *           description: ID del producto
 *           example: "614dfd26ea29ad3f194bad80"
 *         timestamp:
 *           type: String
 *           description: Fecha de creación o modificación del producto
 *           example: "Apr 5 05:06:08"
 *         name:
 *           type: String
 *           description: Nombre del producto
 *           example: "Pampers"
 *         description:
 *           type: String
 *           description: Descripción del producto
 *           example: "Anoche cubrí, mis hijos dormidos, y el ruido del mar."
 *         category:
 *           type: String
 *           description: Categoría del producto
 *           example: "Almacén"
 *         images:
 *           type: Array
 *           description: Array de URLs de la imagen del producto
 *           example: ["https://picsum.photos/200", "https://picsum.photos/200"]
 *         price:
 *           type: number
 *           description: precio del producto
 *           example: 2000
 *         stock:
 *          type: number
 *          description: stock del producto
 *          example: 10
 *     NewProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: String
 *           description: Nombre del producto
 *           example: "Duff Beer"
 *         description:
 *           type: String
 *           description: Descripción del producto
 *           example: "Can of Duff Beer"
 *         category:
 *           type: String
 *           description: Categoría del producto
 *           example: "Drinks"
 *         images:
 *           type: Array
 *           description: Array de URLs de la imagen del producto
 *           example: ["https://picsum.photos/200", "https://picsum.photos/200"]
 *         price:
 *           type: number
 *           description: precio del producto
 *           example: 2
 *         stock:
 *          type: number
 *          description: stock del producto
 *          example: 10
 *     400BadRequest:
 *       type: object
 *       properties:
 *         message:
 *           type: String
 *           description: Error message
 *           example: "Bad Request"
 */