import next from 'next';

import { configs } from '@configs';

import { server } from 'src/server/express';

const {
    dev,
    server: { port },
} = configs.defaultConfig;

const app = next({ dev });
const requestHandler = app.getRequestHandler();

(async () => {
    try {
        await app.prepare();

        server.all('*', (req, res) => requestHandler(req, res));

        server.listen(Number(port), '127.0.0.1', (error?: Error) => {
            if (error) {
                console.error(error);

                return;
            }

            console.log(`Server started on port: ${port}`);
        });
    } catch (error) {
        console.error(error);
    }
})();
