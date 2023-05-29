import { ErrorRequestHandler, RequestHandler, Router } from 'express';

import { serverUrls } from 'src/shared/urls/server';

import {SomeInternalController} from 'src/server/controllers/SomeInternal';

const middlewares: Array<RequestHandler | ErrorRequestHandler> = [];

const apiRouter = Router();

apiRouter.get(serverUrls.getSome, middlewares, SomeInternalController.getAction('getSome'));
apiRouter.put(serverUrls.putSome, middlewares, SomeInternalController.getAction('putSome'));

export { apiRouter };
