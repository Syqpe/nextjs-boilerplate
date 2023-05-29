import { NextFunction, Request, Response } from 'express';

import config from '@yandex-int/yandex-cfg';

import { Domain } from 'src/shared/types/domain';

export default async function languageSetup(req: Request, _res: Response, next: NextFunction) {
    req.lang = config.tldToLang[req.tld || Domain.RU] || 'ru';

    next();
}
