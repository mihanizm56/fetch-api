import nodeFetch from "node-fetch";
import {
  RequestRacerParams,
  ParseResponseParams,
  IRequestParams,
  IRESTResponse,
  FormattedEndpointParams,
  IJSONRPCResponse
} from "@/types/types";
import { parseTypesMap, requestProtocolsMap } from "@/constants/shared";
import { DEFAULT_ERROR_MESSAGE } from "../errors/constants";
import { StatusValidator } from "../validators/response-status-validator";
import { FormatDataTypeValidator } from "../validators/response-type-validator";
import {
  errorRestConstructor,
  errorJSONRPCConstructor
} from "../errors/error-constructor";
import { TIMEOUT_VALUE } from "../constants/timeout";
import { jsonParser } from "../utils/parsers/json-parser";
import { blobParser } from "../utils/parsers/blob-parser";
import { objectToQueryString } from "../utils/object-to-query-string";

type getIsomorphicFetchReturnsType = {
  requestFetch: () => Promise<IRESTResponse | IJSONRPCResponse>;
  fetchController?: AbortController;
};

type getIsomorphicFetchParamsType = {
  endpoint: string;
  fetchParams: Pick<IRequestParams, "headers" | "body" | "mode" | "method">;
};

interface IBaseRequests {
  makeFetch: (
    values: IRequestParams
  ) => Promise<IRESTResponse | IJSONRPCResponse>;

  requestRacer: (params: RequestRacerParams) => Promise<any>;

  parseResponseData: (data: ParseResponseParams) => any;

  getIsomorphicFetch: (
    params: getIsomorphicFetchParamsType
  ) => getIsomorphicFetchReturnsType;
}

export class BaseRequest implements IBaseRequests {
  parseResponseData = ({
    response,
    parseType,
    isResponseOk
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

  // get an isomorfic fetch
  getIsomorphicFetch = ({
    endpoint,
    fetchParams
  }: getIsomorphicFetchParamsType): getIsomorphicFetchReturnsType => {
    if (typeof window === "undefined") {
      const requestFetch = (nodeFetch.bind(
        null,
        endpoint,
        fetchParams
      ) as () => Promise<unknown>) as () => Promise<
        IRESTResponse | IJSONRPCResponse
      >;

      return { requestFetch };
    }

    const fetchController = new AbortController();

    const requestFetch = (window.fetch.bind(null, endpoint, {
      ...fetchParams,
      signal: fetchController.signal
    }) as () => Promise<unknown>) as () => Promise<
      IRESTResponse | IJSONRPCResponse
    >;

    return {
      requestFetch,
      fetchController
    };
  };

  // get serialized endpoint
  getFormattedEndpoint = ({
    endpoint,
    queryParams
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
    requestProtocol,
    id: idOfRequest,
    ...fetchParams
  }: IRequestParams) => {
    const formattedEndpoint = this.getFormattedEndpoint({
      endpoint,
      queryParams
    });

    const { requestFetch, fetchController } = this.getIsomorphicFetch({
      endpoint: formattedEndpoint,
      fetchParams
    });

    const request = requestFetch()
      .then(async (response: any) => {
        const statusValidator = new StatusValidator();
        const isValidStatus = statusValidator.getStatusIsFromWhiteList(
          response.status
        );
        const isResponseOk = response.ok;

        if (isValidStatus) {
          // any type because we did not know about data structure
          const respondedData: any = await this.parseResponseData({
            response,
            parseType,
            isResponseOk
          });

          // validate the format of the request
          const formatDataTypeValidator = new FormatDataTypeValidator({
            respondedData,
            responseSchema,
            requestProtocol
          });

          // get the full validation result
          const isFormatValid: boolean = formatDataTypeValidator.getResponseFormatIsValid();

          if (isFormatValid) {
            return respondedData;
          }
        }

        // if not status from the whitelist - throw error with default error
        throw new Error(
          errorsMap.REQUEST_DEFAULT_ERROR || DEFAULT_ERROR_MESSAGE
        );
      })
      .catch(error => {
        console.error("get error in fetch", error.message);

        return requestProtocol === requestProtocolsMap.rest
          ? errorRestConstructor({
              errorsMap,
              errorTextKey: errorsMap.REQUEST_DEFAULT_ERROR
            })
          : errorJSONRPCConstructor({
              errorsMap,
              errorTextKey: errorsMap.REQUEST_DEFAULT_ERROR,
              id: idOfRequest
            });
      });

    return this.requestRacer({
      request,
      fetchController,
      errorsMap,
      requestProtocol,
      idOfRequest
    });
  };

  requestRacer = ({
    request,
    fetchController,
    errorsMap,
    requestProtocol,
    idOfRequest
  }: RequestRacerParams): Promise<any> => {
    const defaultError =
      requestProtocol === requestProtocolsMap.rest
        ? errorRestConstructor({
            errorsMap,
            errorTextKey: errorsMap.REQUEST_DEFAULT_ERROR
          })
        : errorJSONRPCConstructor({
            errorsMap,
            errorTextKey: errorsMap.REQUEST_DEFAULT_ERROR,
            id: idOfRequest
          });

    const timeoutException = new Promise(resolve =>
      setTimeout(() => {
        // if the window fetch
        if (requestProtocol === requestProtocolsMap.rest) {
          fetchController.abort();
        }

        resolve(defaultError);
      }, TIMEOUT_VALUE)
    ); // eslint-disable-line

    return Promise.race([request, timeoutException]);
  };
}
