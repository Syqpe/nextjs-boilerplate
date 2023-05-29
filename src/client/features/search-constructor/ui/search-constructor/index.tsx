/* eslint-disable no-nested-ternary */
import React, { useState, useCallback, useMemo, FC, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@ccomponents/index';
import { parseQuery, stringifyQuery } from '@cshared/utils/codeQuery';
import {
    LogicOps,
    FilterQuery,
    PossibleMap,
    Fields,
    isCondition,
    PossibleOperators,
    Conditions,
    Values,
    isFields,
    Arg,
    NumberOfPossibleValues,
    PossibleValidation,
    PossibleValidationType,
    PossibleValidationEnums,
} from '@cshared/types/filters';
import { date2Format, format2Date } from '@cshared/utils/dateFormat';
import { AxiosRequestConfig } from 'axios';
import { FetchParams } from '@cshared/hooks/use-request';
import { addDefaultFields, conditionSymbols, isDefaultField } from '../../lib';

import styles from './index.module.scss';

type ChoiceProccess = Fields | Conditions | undefined;

interface Props {
    map: PossibleMap<Fields>;

    fetchData: (customOption?: AxiosRequestConfig | undefined) => Promise<void>;
    fetchParams: FetchParams;
}

const SearchConstructor: FC<Props> = ({ map, fetchParams, fetchData }) => {
    map = addDefaultFields(map);

    // запрос страницы
    const { query, push } = useRouter();
    const [filter, setFilter] = useState<FilterQuery<Fields>>(
        parseQuery(query.filterOptions) || { logic_op: LogicOps.AND, args: [] },
    );

    // текущий выбранные значения
    const [stageValues, setStageValues] = useState<Array<Fields | Conditions | Values>>([]);
    // контролим инпут
    const [value, setValue] = useState<string>();
    // текущий опций на выбор юзера
    const [currentStageValue, setCurrentStageValue] = useState<Array<Fields | Conditions> | NumberOfPossibleValues>(
        Object.keys(map) as Array<Fields>,
    );

    // валидация текущего активного поля
    const [validation, setValidation] = useState<PossibleValidation>({ type: PossibleValidationType.string });

    const handleSetFilter = useCallback(
        async (filterOpt: FilterQuery<Fields> | null) => {
            if (filterOpt) {
                push({
                    query: {
                        ...query,
                        filterOptions: stringifyQuery(filterOpt),
                    },
                });
                const options = { params: { ...fetchParams.options?.params, filter: JSON.stringify(filterOpt) } };
                fetchData(options);
            } else {
                delete query.filterOptions;
                delete fetchParams.options?.params.filter;
                push({
                    query: {
                        ...query,
                    },
                });
                const options = fetchParams.options;
                fetchData(options);
            }
        },
        [query],
    );

    const handleRemoveTag = useCallback((index: number) => {
        setFilter(prevFilter => {
            const localFilter = prevFilter;
            localFilter.args.splice(index, 1);
            if (localFilter.args.length > 0) {
                handleSetFilter(Object.assign({}, localFilter));
            } else {
                handleSetFilter(null);
            }
            return Object.assign({}, localFilter);
        });
    }, []);

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }, []);

    const handleInputKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            const backspace = 8;
            const space = 32;

            const pressedSpace = event.keyCode === space;
            const pressedToBackspace = event.keyCode === backspace;

            if (pressedSpace && validation.type === PossibleValidationType.Date) {
                event.preventDefault();
            }

            const localValue: ChoiceProccess | string = event.currentTarget.value.trim();

            if (pressedToBackspace && stageValues.length > 0 && localValue.length === 0) {
                let localStageValues = Object.assign([], stageValues);

                if (localStageValues.length > 2) {
                    localStageValues = localStageValues.splice(0, 2);
                } else {
                    localStageValues.pop();
                }

                setStageValues(localStageValues);
                setCurrentStageValueByStageValues(localStageValues);
            } else if (
                pressedToBackspace &&
                stageValues.length === 0 &&
                localValue.length === 0 &&
                filter.args.length > 0
            ) {
                const lastArgIndex = filter.args.length - 1;
                const lastArg = filter.args[lastArgIndex];
                handleRemoveTag(lastArgIndex);

                let localStageValues = Object.assign([lastArg.field, lastArg.compare_op], stageValues);
                setStageValues(localStageValues);
                setCurrentStageValueByStageValues(localStageValues);
            }
        },
        [filter, stageValues, validation],
    );

    const handleInputKeyUp = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            const enter = 13;
            const space = 32;

            const pressedSpace = event.keyCode === space;
            const pressedEnter = event.keyCode === enter;
            const pressedToList = event.keyCode === undefined;

            const localValue: ChoiceProccess | string = event.currentTarget.value.trim();

            if (!pressedEnter && validation?.enums?.length && validation?.enums?.indexOf(localValue) === -1) {
                return;
            }

            if (Array.isArray(currentStageValue) && (pressedEnter || pressedSpace || pressedToList)) {
                handleProccess(localValue as ChoiceProccess);
            } else if (!Array.isArray(currentStageValue) && (pressedEnter || pressedSpace)) {
                if (currentStageValue === NumberOfPossibleValues.ONE) {
                    handleFinal([localValue]);
                } else if (currentStageValue === NumberOfPossibleValues.MANY) {
                    if (pressedEnter && (stageValues.length > 2 || localValue.length > 0)) {
                        const localStageValues = stageValues.slice(2) as Array<string>;
                        if (localValue.length > 0) {
                            localStageValues.push(localValue);
                        }
                        handleFinal(localStageValues);
                    } else if (pressedSpace && localValue.length > 0) {
                        setStageValues(prevItems =>
                            prevItems.concat([
                                validation.type === PossibleValidationType.Date ? date2Format(localValue) : localValue,
                            ]),
                        );
                        setValue('');
                    }
                }
            }
        },
        [filter, currentStageValue, stageValues, validation],
    );

    const handleProccess = useCallback(
        (eventValue: ChoiceProccess) => {
            // choice - наличие какого-либо выбора, если существует
            const choice: ChoiceProccess =
                Array.isArray(currentStageValue) && currentStageValue.length !== 0
                    ? currentStageValue.find(currKey => {
                          return (
                              currKey === eventValue ||
                              (eventValue?.[eventValue?.length - 1] === ' ' && currKey === eventValue?.slice(0, -1))
                          );
                      })
                    : eventValue;

            // менджим этапы с выбором
            if (choice && stageValues.length < 2) {
                const localStageValues = stageValues.concat([choice]);
                setStageValues(localStageValues);
                setValue('');
                setCurrentStageValueByStageValues(localStageValues);
            }
        },
        [map, stageValues, currentStageValue],
    );

    const setCurrentStageValueByStageValues = useCallback(
        (localStageValues: Array<Fields | Conditions | Values>) => {
            if (localStageValues.length === 0) {
                setCurrentStageValue(Object.keys(map) as Array<Fields>);
            }

            const field: Fields | null = isFields(localStageValues[0]) ? localStageValues[0] : null;
            if (!field) {
                return;
            }

            if (localStageValues.length === 1) {
                setCurrentStageValue((map?.[field]?.operators as PossibleOperators).map(items => items[0]));
            } else if (localStageValues.length === 2) {
                const fieldOperators = map?.[field]?.operators;
                const fieldValidation = map?.[field]?.validation;

                if (fieldOperators?.length) {
                    const ress = fieldOperators.find(fieldOperator => {
                        const [condition] = fieldOperator;
                        return condition === localStageValues[1];
                    });

                    const numberOfPossibleValues = ress?.[1];

                    if (numberOfPossibleValues) {
                        setCurrentStageValue(numberOfPossibleValues);
                    }
                }

                if (fieldValidation?.type) {
                    setValidation(fieldValidation);
                }
            }
        },
        [map, stageValues],
    );

    const handleFinal = useCallback(
        (eventValue: Array<string>) => {
            // Выбор фильтра сделан
            const localFilter = filter;
            const field: Fields | null = isFields(stageValues[0]) ? stageValues[0] : null;

            if (field && !isDefaultField(field)) {
                const sameFilterFieldIndex = localFilter.args.findIndex(item => item.field === field);
                const pushFilterField: Arg<Fields> = {
                    field: field,
                    compare_op: stageValues[1] as Conditions,
                    values: eventValue,
                };
                if (sameFilterFieldIndex !== -1) {
                    localFilter.args[sameFilterFieldIndex] = pushFilterField;
                } else {
                    localFilter.args.push(pushFilterField);
                }
            } else if (isDefaultField(field)) {
                localFilter.logic_op = eventValue[0] as LogicOps;
            }

            // сохраняем фильтры
            setValue('');
            setFilter(localFilter);
            handleSetFilter(localFilter);
            setStageValues([]);
            setCurrentStageValue(Object.keys(map) as Array<Fields>);
            setValidation({ type: PossibleValidationType.string });
        },
        [map, filter, stageValues],
    );

    const arrClassNameTagChild = [
        styles.search__field,
        styles.search__compareop,
        styles.search__value,
        styles.search__value_arr,
    ];
    const arrPlaceholderInput = ['Enter filter type', 'Enter condition', 'Enter value', 'Enter array of values'];

    const stageValuesFirst = useMemo<Array<Fields | Conditions | Values>>(() => {
        return stageValues.slice(0, 3);
    }, [stageValues]);
    const stageValuesSecond = useMemo<Array<Fields | Conditions | Values>>(() => {
        return stageValues.slice(2);
    }, [stageValues]);

    const enumItems = useMemo<PossibleValidationEnums>(() => {
        return validation?.enums?.filter(
            item => stageValues.indexOf(item as Fields | Conditions | Values) === -1,
        ) as PossibleValidationEnums;
    }, [stageValues, validation]);

    return (
        <div className={styles.search}>
            <div className={styles.search__inner}>
                <div className={styles.search__default_ops}>
                    <div className={styles.search__default_op_item}>
                        <span>Logic operator = {filter.logic_op}</span>
                    </div>
                </div>

                <div className={styles.search__tags}>
                    {filter.args.map((arg, index) => (
                        <div className={styles.search__tag} key={index}>
                            {Object.values(arg).map((argValue: keyof typeof arg, argIndex) => (
                                <div className={arrClassNameTagChild[argIndex]} key={argIndex}>
                                    {Array.isArray(argValue) && argValue.length > 1 ? (
                                        <span>[{argValue.join(', ')}]</span>
                                    ) : (
                                        <span>{isCondition(argValue) ? conditionSymbols[argValue] : argValue}</span>
                                    )}
                                </div>
                            ))}
                            <div className={styles.search__tag_remove}>
                                <Button onClick={() => handleRemoveTag(index)}>
                                    <span>icon</span>
                                </Button>
                            </div>
                        </div>
                    ))}

                    <div className={`${styles.search__tag} ${styles.search__tag_editable}`} key={filter.args.length}>
                        {stageValuesFirst.map((item, index) => (
                            <div
                                className={
                                    arrClassNameTagChild[
                                        index + (currentStageValue === NumberOfPossibleValues.MANY ? 1 : 0)
                                    ]
                                }
                                key={index}
                            >
                                <span>
                                    {isCondition(item)
                                        ? conditionSymbols[item]
                                        : currentStageValue === NumberOfPossibleValues.MANY && index > 1
                                        ? `[${stageValuesSecond.join(', ')}, `
                                        : item}
                                    {currentStageValue === NumberOfPossibleValues.MANY && index > 1 && '...'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.search__enter}>
                    <input
                        required
                        list="search-input"
                        className={styles.search__input}
                        placeholder={
                            arrPlaceholderInput[
                                stageValues.length +
                                    (!Array.isArray(currentStageValue) &&
                                    currentStageValue === NumberOfPossibleValues.MANY
                                        ? 1
                                        : 0)
                            ]
                        }
                        onKeyDown={handleInputKeyDown}
                        onChange={handleInputChange}
                        onKeyUp={handleInputKeyUp}
                        value={validation.type === PossibleValidationType.Date ? format2Date(value || '') : value}
                        type={stageValues.length < 2 ? 'text' : String(validation?.type)}
                        step={validation.type === PossibleValidationType.Date ? '1' : undefined}
                    />
                    {Array.isArray(currentStageValue) && (
                        <datalist className={styles.search__list} id="search-input">
                            <option />
                            {currentStageValue.map((currKey, index) => {
                                return (
                                    <option key={index} value={currKey}>
                                        {isCondition(currKey) ? conditionSymbols[currKey] : currKey}
                                    </option>
                                );
                            })}
                        </datalist>
                    )}
                    {!Array.isArray(currentStageValue) && enumItems?.length && (
                        <datalist className={styles.search__list} id="search-input">
                            <option />
                            {enumItems.map((item, index) => {
                                return (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                );
                            })}
                        </datalist>
                    )}
                </div>
            </div>
        </div>
    );
};

export { SearchConstructor };
