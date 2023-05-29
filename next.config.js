const path = require('path');

const nextYandexComponents = require('@yandex-int/next-yandex-components');

const withYandexComponents = nextYandexComponents(['@yandex-lego/components']);

const isProduction = process.env.NODE_ENV !== 'local';
const productionAssetPrefix = `https://yastatic.net/s3/<%= projectName %>/front/${process.env.APP_VERSION}`;
const assetPrefix = isProduction ? productionAssetPrefix : '';

module.exports = withYandexComponents({
    assetPrefix,
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, 'src/client')],
    },
    env: {
        dima: (() => {
            return 123;
        })(),
    },
    crossOrigin: 'anonymous',
});
