import { Router } from 'express';
import passport from '../middlewares/userAuth';
import { Logger } from '../services/logger';

/**
 * @swagger
 * components:
 *   schemas:
 *     LocalUserData:
 *       type: object
 *       properties:
 *         _id:
 *           type: String
 *           description: ID del usuario
 *           example: "618d72256fc267b7222e8bce"
 *         username:
 *           type: String
 *           description: Nombre de usuario
 *           example: "HomeroElGrande"
 *         email:
 *           type: String
 *           description: Correo electrónico del usuario
 *           example: homero@springfield.com
 *         password:
 *           type: String
 *           description: Contraseña del usuario
 *           example: "12345678"
 *         firstName:
 *           type: String
 *           description: Nombre del usuario
 *           example: "Homero"
 *         lastName:
 *           type: String
 *           description: Apellido del usuario
 *           example: "Simpson"
 *         address:
 *           type: String
 *           description: Dirección del usuario
 *           example: "Av. Siempreviva 456"
 *         phone:
 *           type: String
 *           description: Teléfono del usuario
 *           example: "54-11-34803233"
 *         age:
 *           type: Number
 *           description: Edad del usuario
 *           example: 38
 *         isAdmin:
 *           type: Boolean
 *           description: Indica si el usuario es administrador
 *           example: true
 *         timestamp:
 *           type: Date
 *           description: Fecha de creación / edición del usuario
 *           example: 2021-11-11T16:42:29-03:00
 *     NewLocalUserInput:
 *       type: object
 *       properties:
 *         username:
 *           type: String
 *           description: Nombre de usuario
 *           example: "HomeroElGrande"
 *         email:
 *           type: String
 *           description: Correo electrónico del usuario
 *           example: homero@springfield.com
 *         password:
 *           type: String
 *           description: Contraseña del usuario
 *           example: "12345678"
 *         firstName:
 *           type: String
 *           description: Nombre del usuario
 *           example: "Homero"
 *         lastName:
 *           type: String
 *           description: Apellido del usuario
 *           example: "Simpson"
 *         address:
 *           type: String
 *           description: Dirección del usuario
 *           example: "Av. Siempreviva 456"
 *         phone:
 *           type: String
 *           description: Teléfono del usuario
 *           example: "54-11-34803233"
 *         age:
 *           type: Number
 *           description: Edad del usuario
 *           example: 38
 *         isAdmin:
 *           type: Boolean
 *           description: Indica si el usuario es administrador
 *           example: true
 *     LocalUserLogin:
 *       type: object
 *       properties:
 *         username:
 *           type: String
 *           description: correo electrónico del usuario
 *           example: homero@springfield.com
 *         password:
 *           type: String
 *           description: Contraseña del usuario
 *           example: "12345678"
 */

const router = Router();

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Iniciar sesión con usuario local
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocalUserLogin'
 *     responses:
 *       200:
 *         description: get user data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  $ref: '#/components/schemas/LocalUserData'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "User/Password are not valid"
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('login', function (err, user, info) {
    Logger.debug(user);
    if (!user) return res.status(401).json({ msg: 'Fallo el proceso de login.' });
    user.password = '***PASSWORD***';
    res.json({ msg: 'Welcome!', user: user });
  })(req, res, next);
});
// router.post('/login', passport.authenticate('login'), function (req, res) {
//   res.status(200).json({ msg: 'Welcome!', user: req.user });
// });

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Registro de usuario local
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewLocalUserInput'
 *     responses:
 *       200:
 *         description: get user data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  $ref: '#/components/schemas/LocalUserData'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "User/Password are not valid"
 */
router.post('/signup', (req, res, next) => {
  Logger.debug('POST /api/user/signup');
  passport.authenticate('signup', function (err, user, info) {
    if (err) return next(err);
    if (user.error) return res.status(401).json({ msg: 'Fallo el proceso de signup: ' + user.error });
    res.status(200).json({ msg: 'User Created' });
  })(req, res, next);
});

//Cerrar sesión
router.post('/logout', (req: any, res) => {
  req.session.destroy;
  res.status(200).json({ msg: 'Cerramos la sesion' });
});

export default router;
