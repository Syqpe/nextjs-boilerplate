import { Domain } from 'src/shared/types/domain';

const config = {
    langs: ['ru', 'en'],

    logger: {},

    server: {
        port: Number(process.env.PORT) || 3000,
    },

    tldToLang: {
        [Domain.EN]: 'en',
        [Domain.RU]: 'ru',
    },
};

export { config };
