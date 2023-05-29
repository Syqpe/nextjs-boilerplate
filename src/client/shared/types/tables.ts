import { AuditCreate, AuditModify, BlockedphonesType, ChangeInfoInterface } from './yasms';

enum RowType {
    OLD = 'OLD',
    NEW = 'NEW',
    UPDATED = 'UPDATED',
}

enum RowModeType {
    UPDATE = 'UPDATE',
    DEFAULT = 'DEFAULT',
}

interface RowInterface {
    auditCreate?: AuditCreate;
    auditModify?: AuditModify;

    rowType: RowType;
    rowMode: RowModeType;
    rowId: string;

    // велосипед для закрытия бага  сы
    change_info?: ChangeInfoInterface;
}

interface RouteRowInterface extends RowInterface {
    ruleId?: string;
    destination?: string;

    gateId1?: string;
    gateId2?: string;
    gateId3?: string;

    mode?: string;
    weight?: number;
    region?: string;

    gateId1Consumer?: string | undefined;
    gateId1Fromname?: string;
    gateId1Aliase?: string | undefined;
    gateId1Protocol?: string | undefined;

    gateId2Consumer?: string | undefined;
    gateId2Fromname?: string;
    gateId2Aliase?: string | undefined;
    gateId2Protocol?: string | undefined;

    gateId3Consumer?: string | undefined;
    gateId3Fromname?: string;
    gateId3Aliase?: string | undefined;
    gateId3Protocol?: string | undefined;
}

interface GateRowInterface extends RowInterface {
    gateId?: string;
    aliase?: string;
    protocol?: string;
    fromname?: string;
    consumer?: string;
    contractor?: string;
    extra?: {
        [key: string]: string | number | object;
    };
}

interface FallbackRowInterface extends RowInterface {
    id?: string;
    protocol?: string;
    srcgate?: string;
    srcname?: string;
    dstgate?: string;
    dstname?: string;
    order?: number;
}

interface BlockedphoneRowInterface extends RowInterface {
    blockid?: string;
    blocktill?: Date;
    blocktype?: BlockedphonesType;
    phone?: string;
}

interface RegionRowInterface extends RowInterface {
    id?: string;
    prefix?: string;
    name?: string;
}

interface TemplateRowInterface extends RowInterface {
    id?: string;
    text?: string;
    abcService?: string;
    sender?: string;
    senderMeta?: string;
    fieldsDescription?: string;
}

export { RowType, RowModeType };
export type {
    RowInterface,
    RouteRowInterface,
    GateRowInterface,
    FallbackRowInterface,
    BlockedphoneRowInterface,
    RegionRowInterface,
    TemplateRowInterface,
};
