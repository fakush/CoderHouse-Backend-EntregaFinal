import { Router } from 'express';
import { authController } from '../controllers/authController';
import { isAdmin } from '../middlewares/isAdmin';
import asyncHandler from 'express-async-handler';

const router = Router();

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login de usuario
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: body
 *         name: loginData
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/loginData'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/loggedData'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/401InvalidCredentials'
 */
router.post('/login', authController.checkValidUserAndPassword, asyncHandler(authController.login));

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: body
 *         name: signupData
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/signupData'
 *     responses:
 *       200:
 *         description: User signed up successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/signedData'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.post('/signup', authController.checkSamePassword, authController.checkExistingUser, asyncHandler(authController.signup as any));

router.get('/secure-data', authController.checkUserAuth, (req, res) => {
  res.json({ msg: 'Llegaste a la data segura' });
});

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logout de usuario
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                   type: string
 *                   description: Mensaje de exito
 *                   example: "User logged out successfully"
 */
router.post('/logout', (req: any, res) => {
  req.session.destroy;
  res.status(200).json({ msg: 'User logged out successfully' });
});

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     loginData:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Username
 *           example: Apu8kids
 *         password:
 *           type: string
 *           description: Password
 *           example: ApuRules2021
 *     loggedData:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: Message
 *           example: User logged in successfully
 *         token:
 *           type: string
 *           description: JSON Web Token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *     signedData:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: Message
 *           example: signup OK
 *         token:
 *           type: string
 *           description: JSON Web Token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *     signupData:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Username
 *           example: PpalSkinner
 *         email:
 *           type: string
 *           description: Email Address
 *           example: skinner@springfield.com
 *         password:
 *           type: string
 *           description: Password
 *           example: ArmandoBarredaRules
 *         passwordConfirm:
 *           type: string
 *           description: Password Confirmation
 *           example: ArmandoBarredaRules
 *         firstName:
 *           type: string
 *           description: First Name
 *           example: Armando
 *         lastName:
 *           type: string
 *           description: Last Name
 *           example: Barreda
 *         address:
 *           type: Object
 *           description: Delivery address
 *           example: {
 *             street: "Av. Siempreviva",
 *             number: "456",
 *             floor: 0,
 *             apartment: "A",
 *             postalCode: "1425",
 *             city: "Springfield",
 *             state: "IL"
 *           }
 *         phone:
 *           type: string
 *           description: Phone Number
 *           example: 555-555-5555
 *         age:
 *           type: integer
 *           description: Age
 *           example: 12
 *         isAdmin:
 *           type: boolean
 *           description: Is Admin
 *           example: true
 *     401InvalidCredentials:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: Message
 *           example: "Invalid Username/Password"
 *     401Unauthorized:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: Message
 *           example: "Unathorized"
 */ 