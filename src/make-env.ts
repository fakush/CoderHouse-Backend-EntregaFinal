import fs from 'fs';
import { Logger } from './utils/logger';

fs.renameSync('../.env.example', './.env');
Logger.info('.env file created');
