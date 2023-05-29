import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line import/no-extraneous-dependencies
const MissingMiddlewareError = require('missing-middleware-error');

export default function (req: Request, res: Response, next: NextFunction) {
    if (req.tld === undefined) {
        throw new MissingMiddlewareError('express-tld');
    }

    if (req.blackbox === undefined) {
        throw new MissingMiddlewareError('express-blackbox');
    }

    // @see https://wiki.yandex-team.ru/passport/secondauthcookie/
    const WRONG_GUARD: boolean = req.blackbox.status === 'WRONG_GUARD';
    const NEED_RESET: boolean = req.blackbox.status === 'NEED_RESET';
    const INVALID: boolean = req.blackbox.status === 'INVALID';
    // @see http://doc.yandex-team.ru/Passport/AuthDevGuide/concepts/authorization-policy-resign.xml
    if (req.method === 'GET' && (WRONG_GUARD || NEED_RESET || INVALID)) {
        let retpath = req.headers['x-original-url'] || 'https://' + req.hostname + req.originalUrl;

        let path: string = '';
        if (NEED_RESET) {
            path = 'auth/update';
        } else {
            path = WRONG_GUARD ? 'auth/guard' : 'auth';
        }

        let passUrl =
            'https://passport.yandex-team.' +
            req.tld +
            `/${path}?retpath=` +
            encodeURIComponent(Array.isArray(retpath) ? retpath.join('') : retpath);

        req.logger.info('%s %s %s', 'REDIRECT', path, req.blackbox.status);

        res.redirect(passUrl);
        return;
    }

    req.logger.info('%s %s', 'NOT REDIRECTED', req.blackbox.status);

    next();
}
