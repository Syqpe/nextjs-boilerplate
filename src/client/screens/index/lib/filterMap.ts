import { operators_EN, operators_ENCS, operators_ENML } from '@cfeatures/index';
import { PossibleMap, PossibleValidationType, RouteFields } from '@cshared/types/filters';

export const filterMap: PossibleMap<RouteFields> = {
    destination: {
        operators: operators_ENCS,
    },
    mode: {
        operators: operators_ENCS,
    },
    weight: {
        operators: operators_ENML,
        validation: {
            type: PossibleValidationType.number,
        },
    },
    gateid: {
        operators: operators_EN,
        validation: {
            type: PossibleValidationType.number,
        },
    },
    aliase: {
        operators: operators_ENCS,
    },
    fromname: {
        operators: operators_ENCS,
    },
    gateid2: {
        operators: operators_EN,
        validation: {
            type: PossibleValidationType.number,
        },
    },
    aliase2: {
        operators: operators_ENCS,
    },
    fromname2: {
        operators: operators_ENCS,
    },
    gateid3: {
        operators: operators_EN,
        validation: {
            type: PossibleValidationType.number,
        },
    },
    aliase3: {
        operators: operators_ENCS,
    },
    fromname3: {
        operators: operators_ENCS,
    },
};
