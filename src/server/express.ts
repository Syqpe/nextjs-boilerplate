import express from 'express';

import { router } from 'src/server/router';

const server = express();

server.disable('x-powered-by').enable('trust proxy').use(router);

export { server };
