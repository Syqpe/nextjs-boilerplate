import 'express';

import { Language } from '@yandex-int/i18n';

declare module 'express' {
    interface Request {
        lang: Language;

        logger: winston.Logger;
    }
}
