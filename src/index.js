require('dotenv').config();

import { startDefaultServer } from './server';
import logger from './logger';

import Hydra from './hydra';

const connect = async (next) => {
  // @TODO Connect database based on configuration from .env file in the parent project
  next();
};

export async function bootstrap(args, init) {
  try {
    await Hydra.init(args);
    await Hydra.registerRoutes();
    connect(() => {
      init();
    });
  } catch (err) {
    logger.error(err);
  }
}

export const startServer = startDefaultServer;

export default {
  bootstrap,
  startServer,
};
