import { QueryParamsType } from '@/index.d.ts';

export const objectToQueryString = (queryParams?: QueryParamsType): string =>
  queryParams
    ? Object.keys(queryParams).reduce(
        (acc, queryParamKey, index, queryParamsArray) => {
          const key = encodeURIComponent(queryParamKey);
          const value = encodeURIComponent(queryParams[queryParamKey]);

    acc += `${key}=${value}`; // eslint-disable-line

          if (index !== queryParamsArray.length - 1) {
      acc += '&'; // eslint-disable-line
          }

          return acc;
        },
        '',
      )
    : '';
