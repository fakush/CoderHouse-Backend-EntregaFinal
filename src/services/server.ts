import express, { Request, Response, ErrorRequestHandler } from 'express';
import Config from '../config';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import * as http from 'http';
import routersIndex from '../routes/index';
import compression from 'compression';
import { Logger } from '../utils/logger';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { mongoURL } from './mongodb';

const app = express();
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// paths
const publicFolderPath = process.cwd() + '/public';
const uploadsFolderPath = process.cwd() + '/assets/images';
const layoutDirPath = process.cwd() + '/views/layouts';
const defaultLayerPth = process.cwd() + '/views/layouts/index.hbs';
const partialDirPath = process.cwd() + '/views/partials';

//Error Handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  Logger.error(`HUBO UN ERROR ${err}`);
  res.status(500).json({
    err: err.message
  });
};
app.use(errorHandler);

// Setea el uso de compresion.
app.use(compression());

//? Seteo bodyParser?
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// Setea el uso de helmet.
// app.use(helmet());

// Express & Handlebars Setup
app.use(express.static(publicFolderPath));
app.use(express.static(uploadsFolderPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.set('view engine', 'hbs');
// app.engine(
//   'hbs',
//   handlebars({
//     layoutsDir: layoutDirPath,
//     extname: 'hbs',
//     defaultLayout: defaultLayerPth,
//     partialsDir: partialDirPath
//   })
// );

//Login
const unMinuto = 1000 * 60;

const StoreOptions = {
  store: MongoStore.create({
    mongoUrl: mongoURL,
    dbName: 'kwikemartonline-users',
    stringify: false,
    autoRemove: 'interval',
    autoRemoveInterval: 1
  }),
  secret: 'APU_S3CR3T_K3Y',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: Number(Config.SESSION_COOKIE_TIMEOUT_MIN) * 60 * 1000 }
};

app.use(cookieParser());
app.use(session(StoreOptions));

// Test para ver si funciona el logeo de usuarios
// TODO: Eliminar despues de que se haya probado
// app.use((req, res, next) => {
//   console.log(`REQ.SESSION =>\n${JSON.stringify(req.session)}`.yellow);
//   console.log(`REQ.USER =>\n${JSON.stringify(req.user)}`.yellow);
//   next();
// });

// Main Page
app.get('/', (req: Request, res) => {
  res.render('main');
});

// Use routers
app.use('/api', routersIndex);

// Swagger Documentation
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kwik-E-Mart Online / Backend API',
      version: '0.0.1',
      description: 'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'Facundo Creus',
        url: 'https://github.com/fakush',
        email: 'fcreus@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server'
      }
    ]
  },
  apis: ['src/routes/*']
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const myServer = new http.Server(app);
export default myServer;
