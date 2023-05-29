import {
    Conditions,
    DefaultFields,
    Fields,
    LogicOps,
    NumberOfPossibleValues,
    PossibleMap,
    PossibleOperators,
    PossibleValidationType,
} from '@cshared/types/filters';

const conditionSymbols = {
    [Conditions.EQUAL]: '=',
    [Conditions.NOT_EQUAL]: '!=',
    [Conditions.MORE]: '>',
    [Conditions.LESS]: '<',
    [Conditions.CONTAINS]: '∋',
    [Conditions.STARTS_WITH]: '^',
};

const operators_ENC: PossibleOperators = [
    [Conditions.EQUAL, NumberOfPossibleValues.MANY],
    [Conditions.NOT_EQUAL, NumberOfPossibleValues.MANY],
    [Conditions.CONTAINS, NumberOfPossibleValues.ONE],
];

const operators_EN: PossibleOperators = [
    [Conditions.EQUAL, NumberOfPossibleValues.MANY],
    [Conditions.NOT_EQUAL, NumberOfPossibleValues.MANY],
];

const operators_ENCS: PossibleOperators = [
    [Conditions.EQUAL, NumberOfPossibleValues.MANY],
    [Conditions.NOT_EQUAL, NumberOfPossibleValues.MANY],
    [Conditions.CONTAINS, NumberOfPossibleValues.ONE],
    [Conditions.STARTS_WITH, NumberOfPossibleValues.ONE],
];

const operators_ENML: PossibleOperators = [
    [Conditions.EQUAL, NumberOfPossibleValues.MANY],
    [Conditions.NOT_EQUAL, NumberOfPossibleValues.MANY],
    [Conditions.MORE, NumberOfPossibleValues.ONE],
    [Conditions.LESS, NumberOfPossibleValues.ONE],
];

const operators_ML: PossibleOperators = [
    [Conditions.MORE, NumberOfPossibleValues.ONE],
    [Conditions.LESS, NumberOfPossibleValues.ONE],
];

const defaultFields: Array<DefaultFields> = ['logicOp'];

const addDefaultFields = (map: PossibleMap<Fields>) => {
    map.logicOp = {
        operators: [[Conditions.EQUAL, NumberOfPossibleValues.ONE]],
        validation: {
            type: PossibleValidationType.string,
            enums: [LogicOps.AND, LogicOps.OR],
        },
    };

    return map;
};

const isDefaultField = (field: Fields | string | number | null): boolean => {
    return defaultFields.indexOf(field as DefaultFields) !== -1;
};

export {
    conditionSymbols,
    operators_EN,
    operators_ENC,
    operators_ENCS,
    operators_ENML,
    operators_ML,
    isDefaultField,
    addDefaultFields,
};
