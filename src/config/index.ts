import dotenv from 'dotenv';
import { Logger } from '../services/logger';

Logger.info('Inicializando en entorno: ' + process.env.NODE_ENV);
dotenv.config();

const venv = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  PORT: process.env.PORT || 8080,
  SESSION_COOKIE_TIMEOUT_MIN: process.env.SESSION_COOKIE_TIMEOUT_MIN || 30,

  MONGO_ATLAS_USER: process.env.MONGO_ATLAS_USER || 'user',
  MONGO_ATLAS_PASSWORD: process.env.MONGO_ATLAS_PASSWORD || 'pwd',
  MONGO_ATLAS_CLUSTER: process.env.MONGO_ATLAS_CLUSTER || 'clusterUrl',
  MONGO_ATLAS_DBNAME: process.env.MONGO_ATLAS_DBNAME || 'dbName',

  MONGO_LOCAL_DBNAME: process.env.MONGO_LOCAL_DBNAME || 'dbNameLocal',

  ETHEREAL_USERNAME: process.env.ETHEREAL_USERNAME || 'user',
  ETHEREAL_EMAIL: process.env.ETHEREAL_EMAIL || 'email',
  ETHEREAL_PASSWORD: process.env.ETHEREAL_PASSWORD || 'pwd',

  GMAIL_USERNAME: process.env.GMAIL_USERNAME || 'user',
  GMAIL_EMAIL: process.env.GMAIL_EMAIL || 'email',
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || 'pwd'
};

export default venv;
