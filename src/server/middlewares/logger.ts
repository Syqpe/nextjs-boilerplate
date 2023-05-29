import { NextFunction as Next, Request, Response } from 'express';

import { createLogger, transports } from 'winston';

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

export default function () {
    return (req: Request, _res: Response, next: Next) => {
        req.logger = createLogger({
            levels: logLevels,
            transports: [new transports.Console()],
        });

        next();
    };
}
