import { NextFunction as Next, Request, Response } from 'express';

import config from '@yandex-int/yandex-cfg';

export default async function localTld(req: Request, _res: Response, next: Next) {
    if (!req.tld) {
        req.tld = config.langs[0];
    }

    next();
}
