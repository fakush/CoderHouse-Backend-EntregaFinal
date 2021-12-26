import { Router } from 'express';
import { cartController } from '../controllers/cartsController';
import asyncHandler from 'express-async-handler';

const router = Router();

/**
 * @swagger
 * /api/cart/:id:
 *   get:
 *     summary: Devuelve un carrito
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         id: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario al que pertenece el carrito
 *     responses:
 *       200:
 *         description: get cart by userId
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  $ref: '#/components/schemas/CartData'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/400BadRequest' 
 */
router.get('/:id', cartController.lookForId, asyncHandler(cartController.getCart as any));

/**
 * @swagger
 * /api/cart/:id:
 *   post:
 *     summary: Ingresa un producto al carrito
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         id: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario al que pertenece el carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewCartInput'
 *     responses:
 *       200:
 *         description: Devuelve el carrito con el producto ingresado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  msg: 'creando productos'
 *                  $ref: '#/components/schemas/CartData'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.post('/:id', cartController.lookForId, asyncHandler(cartController.add2Cart as any));

/**
 * @swagger
 * /api/cart/:id:
 *   delete:
 *     summary: Elimina un producto del carrito o actualiza la cantidad de productos
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         id: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario al que pertenece el carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewCartInput'
 *     responses:
 *       200:
 *         description: Devuelve el carrito con el producto ingresado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  msg: 'creando productos'
 *                  $ref: '#/components/schemas/CartData'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.delete('/:id', cartController.lookForId, asyncHandler(cartController.deleteProducts as any));

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     CartData:
 *       type: object
 *       properties:
 *         _id:
 *           type: String
 *           description: ID del producto
 *           example: "614dfd26ea29ad3f194bad80"
 *         userId:
 *           type: String
 *           description: ID del usuario al que pertenece el carrito
 *           example: "618d72256fc267b7222e8bce"
 *         products:
 *           type: Array
 *           description: Lista de productos que contiene el carrito
 *           example: [{product: "614dfd26ea29ad3f194bad80", amount: 1}]
 *     NewCartInput:
 *       type: object
 *       properties:
 *         product:
 *           type: String
 *           description: ID del producto
 *           example: "614dfd26ea29ad3f194bad80"
 *         amount:
 *           type: Number
 *           description: Cantidad de productos
 *           example: 1
 */
