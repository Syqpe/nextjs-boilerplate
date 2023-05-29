let ENV = process.env.CONFIG_ENV || process.env.NODE_ENV || process.env.QLOUD_ENVIRONMENT;

const getConfig = () => {
    switch (ENV) {
        case 'local':
            return require('./local');
        case 'testing':
            return require('./testing');
        case 'production':
            return require('./production');
        default:
            return require('./local');
    }
};

const configs = getConfig();

export { configs };
