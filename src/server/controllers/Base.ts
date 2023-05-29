import { NextFunction as Next, Request, Response } from 'express';
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import { ControllerInstance } from '../types/controllers';

class BaseController {
    public static getAction(actionName: string) {
        return async (req: Request, res: Response, next: Next): Promise<void> => {
            const classInstance = new this(req, res, next) as ControllerInstance;

            try {
                await classInstance[actionName]();
            } catch (err) {
                next(err);
            }
        };
    }

    protected req: Request;
    protected res: Response;
    protected next: Next;
    protected config: AxiosRequestConfig | undefined;
    protected dao: AxiosInstance;

    public constructor(req: Request, res: Response, next: Next, daoConfig?: AxiosRequestConfig | undefined) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.config = daoConfig;
        this.dao = axios.create(daoConfig);
    }

    protected sendJson(data: any, status = 200) {
        return this.res.status(status).json(data);
    }
}

export { BaseController };
