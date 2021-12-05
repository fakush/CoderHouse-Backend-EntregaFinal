import myServer from './services/server';
import Config from './config';
import { portArgument } from './config/arguments';
import { Logger } from './services/logger';
import initWsServer from './services/sockets';
import { Console } from 'console';

const port = portArgument || Config.PORT;

initWsServer(myServer);
myServer.listen(port, () => Logger.info(`SERVER UP IN PORT ${port}`));
myServer.on('error', (err) => {
  Logger.error('SERVER ERROR: ', err);
});

// Imprimo en Consola el código de salida
process.on('exit', (code) => {
  Logger.error(`Exit ==> El proceso termino con codigo ${code}\n\n`);
});
