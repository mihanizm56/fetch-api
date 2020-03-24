import {
  RequestRacerParams,
  ParseResponseParams,
  IRequestParams,
  IBaseResponse,
  FormattedEndpointParams,
} from '@/types/types';
import { parseTypesMap } from '@/constants/shared';
import { DEFAULT_ERROR_MESSAGE } from '../../errors/constants';
import { StatusValidator } from '../../validators/response-status-validator';
import { FormatDataTypeValidator } from '../../validators/response-type-validator';
import { errorConstructor } from '../../errors/error-constructor';
import { TIMEOUT_VALUE } from '../../constants/timeout';
import { jsonParser } from '../../utils/parsers/json-parser';
import { blobParser } from '../../utils/parsers/blob-parser';
import { objectToQueryString } from '../../utils/object-to-query-string';

interface IBaseRequests {
  makeFetch: (values: IRequestParams) => Promise<IBaseResponse>;

  requestRacer: (params: RequestRacerParams) => Promise<any>;

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

      // default parse to json
      default:
        return jsonParser(response);
    }
  };

  // get serialized endpoint
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
    errorsMap,
    responseSchema,
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

          // validate the format of the request
          const formatDataTypeValidator = new FormatDataTypeValidator({
            respondedData,
            responseSchema,
          });

          // get the full validation result
          const isFormatValid: boolean = formatDataTypeValidator.getResponseFormatIsValid();

          if (isFormatValid) {
            return respondedData;
          }
        } else {
          // if not status from the whitelist - throw error
          throw new Error(
            errorsMap.REQUEST_DEFAULT_ERROR || DEFAULT_ERROR_MESSAGE,
          );
        }
      })
      .catch(error => {
        console.error('get error in fetch', error.message);

        return errorConstructor({
          errorsMap,
          errorTextKey: errorsMap.REQUEST_DEFAULT_ERROR,
        });
      });

    return this.requestRacer({ request, fetchController, errorsMap });
  };

  requestRacer = ({
    request,
    fetchController,
    errorsMap,
  }: RequestRacerParams): Promise<any> => {
    const defaultError = errorConstructor({
      errorTextKey: errorsMap.TIMEOUT_ERROR,
      errorsMap,
    });

    const timeoutException = new Promise(resolve =>
      setTimeout(() => {
        fetchController.abort();
        resolve(defaultError);
      }, TIMEOUT_VALUE),
    ); // eslint-disable-line

    return Promise.race([request, timeoutException]);
  };
}
