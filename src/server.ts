import config from './config/config';
import { Database } from './utils/database';
import app from './app';

export const startServer = async () => {
  process.on('uncaughtException', e => {
    console.error(e);
    process.exit(1);
  });

  process.on('unhandledRejection', e => {
    console.error(e);
    process.exit(1);
  });

  await Database.connect(config.database.url);

  const { port = 6064 } = config;

  // eslint-disable-next-line no-console
  return app.listen(port, () => console.info(`Server is running at ${config.app.baseUrl}:${port}...`));
};

startServer();
