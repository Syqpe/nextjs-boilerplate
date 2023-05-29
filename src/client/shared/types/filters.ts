enum LogicOps {
    AND = 'AND',
    OR = 'OR',
}

enum Conditions {
    EQUAL = 'EQUAL',
    NOT_EQUAL = 'NOT_EQUAL',
    MORE = 'MORE',
    LESS = 'LESS',
    CONTAINS = 'CONTAINS',
    STARTS_WITH = 'STARTS_WITH',
}

type DefaultFields = 'logicOp';

type RegionFields = 'prefix' | 'name' | DefaultFields;

type BlockedphoneFields = 'blockid' | 'blocktill' | 'blocktype' | 'phone' | DefaultFields;

type FallbackFields = 'id' | 'srcgate' | 'srcname' | 'dstgate' | 'dstname' | 'order' | DefaultFields;

type GateFields = 'gateid' | 'aliase' | 'fromname' | DefaultFields;

type RouteFields =
    | 'mode'
    | 'destination'
    | 'weight'
    | 'gateid'
    | 'aliase'
    | 'fromname'
    | 'gateid2'
    | 'aliase2'
    | 'fromname2'
    | 'gateid3'
    | 'aliase3'
    | 'fromname3'
    | DefaultFields;

type Fields = RouteFields | GateFields | FallbackFields | BlockedphoneFields | RegionFields;

type Values = Array<string> | [string];

interface Arg<T> {
    field: T;
    compare_op: Conditions;
    values: Values;
}

interface FilterQuery<T extends Fields> {
    logic_op: LogicOps;
    args: Array<Arg<T>>;
}

//

enum NumberOfPossibleValues {
    ONE = 'ONE',
    MANY = 'MANY',
}

enum PossibleValidationType {
    number = 'number',
    string = 'string',
    boolean = 'boolean',
    Date = 'datetime-local',
}

type PossibleValidationEnums = Array<number | string>;

type PossibleValidation = {
    type: PossibleValidationType;
    enums?: PossibleValidationEnums;
};

type PossibleOperators = Array<[Conditions, NumberOfPossibleValues]>;

type PossibleMap<T extends Fields> = {
    [key in T]?: {
        operators: PossibleOperators;

        // Если не указать параметр валидаций, то будет дефолтный string
        validation?: PossibleValidation;
    };
};

const isFields = (x: Fields | Conditions | Values): x is Fields => {
    return !(Array.isArray(x) || Boolean(Conditions[x]));
};

const isCondition = (x: keyof Arg<Fields> | Fields | Conditions | Values): x is Conditions => {
    return Array.isArray(x) ? false : Boolean(Conditions[x]);
};

export type {
    FilterQuery,
    Arg,
    DefaultFields,
    Fields,
    RouteFields,
    BlockedphoneFields,
    FallbackFields,
    GateFields,
    RegionFields,
    Values,
    PossibleValidationEnums,
    PossibleValidation,
    PossibleOperators,
    PossibleMap,
};
export { LogicOps, Conditions, NumberOfPossibleValues, PossibleValidationType, isFields, isCondition };
