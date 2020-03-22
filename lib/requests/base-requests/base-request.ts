import {
  IRequestParams,
  IBaseResponse,
  parseTypesMap,
} from '../../_types/types';
import { REQUEST_ERROR, TIMEOUT_ERROR } from '../../errors/_constants';
import { StatusValidator } from '../../validators/response-status-validator';
import { FormatDataTypeValidator } from '../../validators/response-type-validator';
import { errorConstructor } from '../../errors/error-constructor';
import { TIMEOUT_VALUE } from '../../_constants/timeout';

import { jsonParser } from '../../_utils/parsers/json-parser';
import { blobParser } from '../../_utils/parsers/blob-parser';
import {
  objectToQueryString,
  QueryParamsType,
} from '../../_utils/object-to-query-string';

type requestRacerParams = {
  request: Promise<IBaseResponse>;
  fetchController: any;
};

type ParseResponseParams = {
  response: IBaseResponse;
  parseType?: keyof typeof parseTypesMap;
  isResponseOk: boolean;
};

type FormattedEndpointParams = {
  endpoint: string;
  queryParams?: QueryParamsType;
};

interface IBaseRequests {
  makeFetch: (values: IRequestParams) => Promise<IBaseResponse>;

  requestRacer: (params: requestRacerParams) => Promise<any>;

  parseResponseData: (data: ParseResponseParams) => any;
}

export class BaseRequest implements IBaseRequests {
  parseResponseData = ({
    response,
    parseType,
    isResponseOk,
  }: ParseResponseParams) => {
    // if not 200 then always get json format
    if (!isResponseOk) {
      return jsonParser(response);
    }

    switch (parseType) {
      case parseTypesMap.json:
        return jsonParser(response);

      case parseTypesMap.blob:
        return blobParser(response);

      default:
        return jsonParser(response);
    }
  };

  getFormattedEndpoint = ({
    endpoint,
    queryParams,
  }: FormattedEndpointParams): string => {
    if (!Boolean(queryParams)) {
      return endpoint;
    }

    return `${endpoint}?${objectToQueryString(queryParams)}`;
  };

  makeFetch = ({
    endpoint,
    parseType,
    queryParams,
    ...fetchParams
  }: IRequestParams) => {
    const formattedEndpoint = this.getFormattedEndpoint({
      endpoint,
      queryParams,
    });

    const fetchController = new AbortController();

    const request = fetch(formattedEndpoint, {
      ...fetchParams,
      signal: fetchController.signal,
    })
      .then(async (response: any) => {
        const statusValidator = new StatusValidator();
        const isValidStatus = statusValidator.getStatusIsFromWhiteList(
          response.status,
        );
        const isResponseOk = response.ok;

        if (isValidStatus) {
          // any type because we did not know about data structure
          const respondedData: any = await this.parseResponseData({
            response,
            parseType,
            isResponseOk,
          });

          const formatDataTypeValidator = new FormatDataTypeValidator(
            respondedData,
          );

          const isFormatValid: boolean = formatDataTypeValidator.getResponseFormatIsValid();

          if (isFormatValid) {
            return respondedData;
          }

          console.error('error in response format validation');
        }

        throw new Error(REQUEST_ERROR);
      })
      .catch(error => {
        console.error('get error in fetch', error.message);

        return errorConstructor(REQUEST_ERROR);
      });

    return this.requestRacer({ request, fetchController });
  };

  requestRacer = ({
    request,
    fetchController,
  }: requestRacerParams): Promise<any> => {
    const defaultError = errorConstructor(TIMEOUT_ERROR);

    const timeoutException = new Promise(resolve =>
      setTimeout(() => {
        fetchController.abort();
        resolve(defaultError);
      }, TIMEOUT_VALUE),
    ); // eslint-disable-line

    return Promise.race([request, timeoutException]);
  };
}
