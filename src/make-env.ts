import fs from 'fs';
import { Logger } from './services/logger';

fs.renameSync('../.env.example', './.env');
Logger.info('.env file created');
