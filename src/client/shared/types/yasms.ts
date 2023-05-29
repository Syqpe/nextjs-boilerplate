interface AuditLog {
    change_id: string;
    ts: number;
}

type AuditCreate = AuditLog;
type AuditModify = AuditLog;

interface Entity {
    audit_create: AuditCreate;
    audit_modify: AuditModify;
}

interface AuditBulkInfoRow {
    change_id: string;
    action: AuditInfoAction;
    entity_id: string;
    payload: string;
}

type AuditInfoAction = 'update' | 'add' | 'delete';

interface ChangeItem {
    action: AuditInfoAction;
    entity_id: string;
    payload: string;
}

interface AuditBulkInfo {
    id: string;
    author: string;
    changes: {
        [key: string]: ChangeItem;
    };
    comment: string;
    issue: string;
    ts: number;
}

interface AuditBulksInfo {
    audit_bulk_info: AuditBulkInfo;
}

interface AuditChangeInfo {
    action: AuditInfoAction;
    bulk_info: {
        id: string;
        author: string;
        comment: string;
        issue: string;
        ts: number;
    };
    entity_id: string;
}

interface AuditChangesInfo {
    audit_changes_info: {
        [key: string]: AuditChangeInfo;
    };
}

enum AccessEnums {
    routes = 'routes',
    gates = 'gates',
    fallbacks = 'fallbacks',
    blockedphones = 'blockedphones',
    regions = 'regions',
    templates = 'templates',
}

interface UserData {
    uid: number;
    roles: {
        read: Array<AccessEnums>;
        write: Array<AccessEnums>;
    };
}

interface Route extends Entity {
    rule_id: string;
    destination: string;
    gates: Array<Gate>;
    mode: string;
    weight: number;
    region: Region;
}

interface Gate extends Entity {
    gateid: string;
    aliase: string;
    protocol: string;
    fromname: string;
    consumer: string;
    contractor: string;
    extra: {
        [key in string]: string | number | object;
    };
}

interface Fallback extends Entity {
    id: string;
    protocol: string;
    srcgate: string;
    srcname: string;
    dstgate: string;
    dstname: string;
    order: number;
}

enum BlockedphonesType {
    permanent = 'permanent',
}

interface Blokedphones extends Entity {
    blockid: string;
    blocktill: Date;
    blocktype: BlockedphonesType;
    phone: string;
}

interface Region extends Entity {
    id: string;
    name: string;
    prefix: string;
}

interface TemplateParse {
    fields_list: Array<string>;
}

interface TemplateEnum {
    protocols: Array<string>;
    senders: Array<string>;
}

interface Template extends Entity {
    id: string;
    text: string;
    abc_service: string;
    sender_meta: {
        whatsapp: {
            id: string;
        };
    };
    sender: Array<string>;
    fields_description: {
        code: {
            privacy: string;
            description: string;
        };
        service: {
            description: string;
        };
    };

    audit_create: {
        change_id: string;
        ts: number;
    };
    audit_modify: {
        change_id: string;
        ts: number;
    };
}

export enum StatusesText {
    'ERROR' = 'ERROR',
    'OK' = 'OK',
}

interface Fail {
    status: number;
    statusText: StatusesText.ERROR;
    message: string;
}

interface GetSuccess<T> {
    status: number;
    statusText: string;
    data: {
        next?: string;
    } & T;
}

type GetRequestInterface<T = {}> = GetSuccess<T> | Fail;

interface MutationSuccess {
    status: number;
    statusText: StatusesText.OK;
    message: string;
}

type MutationRequestInterface = MutationSuccess | Fail;

function isSuccess<T = {}>(response: GetRequestInterface): response is GetSuccess<T> {
    if ((response as GetSuccess<T>).data) {
        return true;
    }
    return false;
}

function isSuccessMutation(response: MutationRequestInterface): response is MutationSuccess {
    if ((response as MutationSuccess).statusText === StatusesText.OK) {
        return true;
    }
    return false;
}

interface ChangeInfoInterface {
    issue: Array<string>;
    comment: string;
}

export type {
    UserData,
    Route,
    Gate,
    Fallback,
    Blokedphones,
    BlockedphonesType,
    Region,
    TemplateParse,
    TemplateEnum,
    Template,
    AuditBulkInfoRow,
    AuditBulkInfo,
    AuditBulksInfo,
    AuditChangeInfo,
    AuditChangesInfo,
    AuditLog,
    AuditCreate,
    AuditModify,
    GetRequestInterface,
    GetSuccess,
    Fail,
    MutationRequestInterface,
    ChangeInfoInterface,
};
export { AccessEnums, isSuccess, isSuccessMutation };
