interface ControllerInstance {
    [methodName: string]: any;
}

interface ResponseDataInterface {
    status: string;
    message: string;
}

interface AuditDataInterface {
    [key: string]: Array<object> | object | string | number | null;
}

interface NextDataInterface {
    [key: string]: Array<object> | object | string | number | null;
    total_count: number | null;
    next: string | null;
}

enum AccessEnums {
    routes = 'routes',
    gates = 'gates',
    blockedphones = 'blockedphones',
    fallbacks = 'fallbacks',
    regions = 'regions',
    templates = 'templates',
}

interface ChangeInfoInterface {
    issue: Array<string>;
    comment: string;
}

interface UserDataInterface {
    uid: number;
    roles: {
        read: Array<AccessEnums>;
        write: Array<AccessEnums>;
    };
}

enum StatusesText {
    'ERROR' = 'ERROR',
    'OK' = 'OK',
}

interface Fail {
    status?: number;
    statusText?: StatusesText.ERROR;
    message?: string;
}

interface GetSuccess<T> {
    status?: number;
    statusText?: string;
    data: T;
}

type GetRequestInterface<T extends Object> = GetSuccess<T> | Fail;

interface PutSuccess {
    status?: number;
    statusText?: StatusesText.OK;
    message?: string;
}

type PutRequestInterface = PutSuccess | Fail;

export type {
    ChangeInfoInterface,
    ControllerInstance,
    ResponseDataInterface,
    AuditDataInterface,
    NextDataInterface,
    UserDataInterface,
    Fail,
    GetSuccess,
    GetRequestInterface,
    PutSuccess,
    PutRequestInterface,
};
export { StatusesText, AccessEnums };
