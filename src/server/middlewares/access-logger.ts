import { NextFunction, Request, Response } from 'express';

import { hrtimeHumanize } from 'src/server/utils/hrtime';

export default async function accessLogger(req: Request, res: Response, next: NextFunction) {
    const timeStart = process.hrtime();

    function log() {
        const timeEnd = process.hrtime(timeStart);
        const { seconds: executionTime } = hrtimeHumanize(timeEnd);

        req.logger.info('%s %s %d %ss', req.method, req.url, res.statusCode, executionTime);
    }

    res.on('finish', log);

    next();
}
