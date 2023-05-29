import { ErrorRequestHandler, RequestHandler, Router } from 'express';

import {
    accessLogger,
    bodyParser,
    checkAuth,
    cookieParser,
    finalErrorHandler,
    helmet,
    lang,
    localTld,
    logger,
    patchIp,
} from 'src/server/middlewares';

import { apiRouter } from 'src/server/router/api';

import { serverUrls } from 'src/shared/urls/server';

const middlewares: (RequestHandler | ErrorRequestHandler)[] = [
    logger,
    accessLogger,
    patchIp,
    cookieParser,
    bodyParser,
    localTld,
    lang,
    checkAuth,
    helmet,
    finalErrorHandler,
];

const router = Router();

router.get(serverUrls.ping, (_req, res) => {
    res.status(200).send('OK!');
});

router.use(middlewares);
router.use(apiRouter);

export { router };
