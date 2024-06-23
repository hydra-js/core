import express from 'express';
import * as exphbs from 'express-handlebars';
import cors from 'cors';
import register from '@babel/register';

import Hydra from './hydra';
import { secure } from './middlewares';
import logger from './logger';

// Register Babel for JSX files
register({
  extensions: ['.jsx'],
});

export const startDefaultServer = async () => {
  const app = express();
  const {
    PORT,
    __layoutdir,
    // __routerdir,
    __partialsdir,
    __templatedir,
    __publicdir,
  } = Hydra.getState();

  app.set('port', PORT);

  app.use(cors());
  app.use(secure);

  app.disable('x-powered-by'); // Reduce fingerprinting
  // @TODO: Use `express-rate-limit`, `xss-clean`, 'hpp' and `helmet`

  // Setup Handlebars
  app.engine(
    'html',
    exphbs.engine({
      defaultLayout: 'index',
      layoutsDir: __layoutdir,
      partialsDir: __partialsdir,
      extname: '.html',
    })
  );
  app.set('view engine', 'html');
  app.set('views', __templatedir);

  // Static files
  app.use(express.static(__publicdir));

  // @TODO: Implement routes
  // const webRouter = require(path.join(__routerdir, 'web'));
  // app.use('*', [Hydra.render], webRouter);

  // Error handling
  app.use((err, req, res, next) => {
    logger.error(err.stack);
    return res.render('500');
  });

  // Start server
  const server = app.listen(PORT, () => {
    logger.log(`Server is running on ::${PORT}`);
  });

  return server;
};

export default { startDefaultServer };
