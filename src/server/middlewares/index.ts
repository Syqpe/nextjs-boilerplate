import bodyParserMiddleware from 'body-parser';
import cookieParserMiddleware from 'cookie-parser';
import { ErrorRequestHandler, Request, RequestHandler, NextFunction } from 'express';
import helmetMiddleware from 'helmet';

import config from '@yandex-int/yandex-cfg';

import accessLoggerMiddleware from 'src/server/middlewares/access-logger';
import finalErrorHandlerMiddleware from 'src/server/middlewares/final-error-handler';
import languageMiddleware from 'src/server/middlewares/language-setup';
import localTldMiddleware from 'src/server/middlewares/local-tld';
import loggerMiddleware from 'src/server/middlewares/logger';
import checkAuthMiddleware from 'src/server/middlewares/check-auth';

export const patchIp: RequestHandler = (req: Request, _res, next: NextFunction) => {
    Object.defineProperty(req, 'ip', { value: req.get('x-real-ip') });
    next();
};

// Writes logs about the current request
export const accessLogger: RequestHandler = accessLoggerMiddleware;

// Adds `body` property to express request object
export const bodyParser: RequestHandler = bodyParserMiddleware.json(config.bodyParser);

// Parses cookies into req.cookies
export const cookieParser: RequestHandler = cookieParserMiddleware();

// Logs error and sends 500
export const finalErrorHandler: ErrorRequestHandler = finalErrorHandlerMiddleware;

// Sets secure headers:
// X-dns-prefetch-control: off
// X-frame-options: SAMEORIGIN
// Strict-transport-security: max-age=15552000; includeSubDomains
// X-download-options: noopen
// X-content-type-options: nosniff
// X-xss-protection: 1; mode=block
export const helmet: RequestHandler = helmetMiddleware(config.helmet);

// Set language into req.lang depending on top level domain
export const lang: RequestHandler = languageMiddleware;

// Set default req.tld for local development
export const localTld: RequestHandler = localTldMiddleware;

// Adds logger instance associated with current request into req.logger
export const logger: RequestHandler = loggerMiddleware();

export const checkAuth: RequestHandler = checkAuthMiddleware;
