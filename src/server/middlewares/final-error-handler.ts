import { NextFunction as Next, Request, Response } from 'express';

export default function(err: Error, req: Request, res: Response, _next: Next) {
    req.logger.error(err);

    res.sendStatus(500);
}
