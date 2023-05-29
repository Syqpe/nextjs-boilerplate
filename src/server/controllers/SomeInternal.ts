import { NextFunction as Next, Request, Response } from 'express';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
    ResponseDataInterface,
    GetRequestInterface,
    NextDataInterface,
    UserDataInterface,
    PutRequestInterface,
    PutSuccess,
    Fail,
    ChangeInfoInterface,
    AuditDataInterface,
} from 'src/server/types/controllers';
import { BaseController } from './Base';
import { configs } from '@configs';

class SomeInternalController extends BaseController {
    constructor(req: Request, res: Response, next: Next) {
        const daoConfig: AxiosRequestConfig = {
            ...configs.api.yasmsInternal.dao,
            headers: {
                'Content-type': 'application/json',
            },
        };
        super(req, res, next, daoConfig);
    }

    public async getSome() {
        // const { limit = 100500, min = 0 } = this.req.query;
        let res: GetRequestInterface<NextDataInterface> = {};
        // this.dao
        //     .get('/1/templates', {
        //         params: {
        //             limit,
        //             min,
        //         },
        //     })
        //     .then((response: AxiosResponse<NextDataInterface>) => {
        //         res = {
        //             status: response.status,
        //             statusText: response.statusText,
        //             data: response.data,
        //         };
        //     })
        //     .catch((err: AxiosError<ResponseDataInterface>) => {
        //         if (err.response) {
        //             res = {
        //                 status: err.response.status,
        //                 statusText: err.response.data.status,
        //                 message: err.response.data.message || err.response.data,
        //             } as Fail;
        //         }
        //     })
        //     .finally(() => {
        //         this.sendJson(res);
        //     });

        this.sendJson([
            {
                title: 'Toro',
                count: 1,
            },
            {
                title: 'Poto',
                count: 10,
            },
            {
                title: 'WoWo',
                count: 100,
            },
        ]);
    }
    public async putSome() {
        // const body: {
        //     update?: TemplatesUpdate;
        //     create?: TemplatesCreate;
        //     change_info?: ChangeInfoInterface;
        // } = this.req.body;
        let res: PutRequestInterface = {};
        // this.dao
        //     .put('/1/templates', body)
        //     .then((response: AxiosResponse<ResponseDataInterface>) => {
        //         res = {
        //             status: response.status,
        //             statusText: response.data.status,
        //             message: response.data.message,
        //         } as PutSuccess;
        //     })
        //     .catch((err: AxiosError<ResponseDataInterface>) => {
        //         if (err.response) {
        //             res = {
        //                 status: err.response.status,
        //                 statusText: err.response.data.status,
        //                 message: err.response.data.message || err.response.data,
        //             } as Fail;
        //         }
        //     })
        //     .finally(() => {
        //         this.sendJson(res);
        //     });

        this.sendJson([
            {
                title: 'Toro',
                count: 1,
            },
            {
                title: 'Poto',
                count: 10,
            },
            {
                title: 'WoWo',
                count: 100,
            },
        ]);
    }
}

export { SomeInternalController };
