import 'http';

import { Language } from '@yandex-int/i18n';

declare module 'http' {
    interface IncomingMessage {
        lang: Language;
    }
}
