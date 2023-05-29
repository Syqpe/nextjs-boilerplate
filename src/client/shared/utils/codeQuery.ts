import { Fields, FilterQuery } from '@cshared/types/filters';

const stringifyQuery = (filterOpt: FilterQuery<Fields>): string => {
    return new URLSearchParams(JSON.stringify(filterOpt)).toString();
};

const parseQuery = (queryAsString: string | string[] | undefined): FilterQuery<Fields> | null => {
    return queryAsString
        ? JSON.parse(
              decodeURI(String(queryAsString))
                  .replace(/(\+|(%2B))+/g, '+')
                  .replace(/(&|(%2C))+/g, ',')
                  .replace(/(=|(%3A))+/g, ':')
                  .replace(/(:|=|(%3A))$/g, ''),
          )
        : null;
};

export { stringifyQuery, parseQuery };
