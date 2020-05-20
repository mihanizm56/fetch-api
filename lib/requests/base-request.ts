import nodeFetch from "node-fetch";
import {
  RequestRacerParams,
  ParseResponseParams,
  IRequestParams,
  FormattedEndpointParams,
  IResponse,
  IJSONPRCRequestParams,
  GetIsomorphicFetchParamsType,
  GetIsomorphicFetchReturnsType,
  GetFetchBodyParamsType,
  GetPreparedResponseDataParams,
  FormatResponseParamsType,
  GetPreparedPureRestResponseDataParams,
} from "@/types/types";
import {
  parseTypesMap,
  requestProtocolsMap,
  NETWORK_ERROR_KEY,
  TIMEOUT_ERROR_KEY,
} from "@/constants/shared";
import { StatusValidator } from "../validators/response-status-validator";
import { FormatDataTypeValidator } from "../validators/response-type-validator";
import { ErrorResponseFormatter } from "../errors-formatter/error-response-formatter";
import { TIMEOUT_VALUE } from "../constants/timeout";
import { jsonParser } from "../utils/parsers/json-parser";
import { blobParser } from "../utils/parsers/blob-parser";
import { objectToQueryString } from "../utils/object-to-query-string";
import { FormatResponseFactory } from "@/formatters/format-response-factory";

interface IBaseRequests {
  makeFetch: (
    values: IRequestParams &
      IJSONPRCRequestParams & {
        requestProtocol: keyof typeof requestProtocolsMap;
      } & { method: string }
  ) => Promise<IResponse>;

  requestRacer: (params: RequestRacerParams) => Promise<any>;

  parseResponseData: (data: ParseResponseParams) => any;

  getIsomorphicFetch: (
    params: GetIsomorphicFetchParamsType
  ) => GetIsomorphicFetchReturnsType;
}

export class BaseRequest implements IBaseRequests {
  parseResponseData = ({
    response,
    parseType,
    isResponseOk,
    isStatusEmpty
  }: ParseResponseParams) => {
    // if not "not ok" status then always get json format
    if(isStatusEmpty){
      return {}
    }

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
    fetchParams,
  }: GetIsomorphicFetchParamsType): GetIsomorphicFetchReturnsType => {
    if (typeof window === "undefined") {
      const requestFetch = (nodeFetch.bind(
        // eslint-disable-line
        null,
        endpoint,
        { ...fetchParams }
      ) as () => Promise<unknown>) as () => Promise<IResponse>;

      return { requestFetch };
    }

    const fetchController = new AbortController();

    const requestFetch = (window.fetch.bind(null, endpoint, {
      ...fetchParams,
      signal: fetchController.signal,
    }) as () => Promise<unknown>) as () => Promise<IResponse>;

    return {
      requestFetch,
      fetchController,
    };
  };

  // get pure response status is "success"
  getIsResponseStatusSuccess = (statusCode: number): boolean =>
    statusCode < 400;

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

  // get formatted fetch body in needed
  getFetchBody = ({
    requestProtocol,
    body,
    method,
    version,
    id,
  }: GetFetchBodyParamsType) => {
    if (method === "GET") {
      return undefined;
    }

    if (requestProtocol === requestProtocolsMap.jsonRpc) {
      return JSON.stringify({ ...body, ...version, id });
    } else {
      if (body instanceof FormData) {
        return body;
      } else {
        return JSON.stringify(body);
      }
    }
  };

  // get prepared pure rest response data TODO REFACTOR THIS FORMATTING!!!!!!
  getPreparedPureRestResponseData = ({
    isResponseStatusSuccess,
    respondedData,
    statusCode,
  }: GetPreparedPureRestResponseDataParams): IResponse => ({
    error: !isResponseStatusSuccess,
    errorText: isResponseStatusSuccess ? "" : respondedData.errorText,
    data: isResponseStatusSuccess ? { ...respondedData } : {},
    additionalErrors: isResponseStatusSuccess
      ? null
      : respondedData.additionalErrors,
    code: statusCode,
  });

  // TODO REFACTOR THIS FORMATTING!!!!!!
  getPreparedResponseData = ({
    response,
    translateFunction,
    protocol,
    isErrorTextStraightToOutput,
    isBlobGetRequest,
    statusCode,
    isResponseStatusSuccess,
  }: GetPreparedResponseDataParams): FormatResponseParamsType => {
    if (isBlobGetRequest) {
      return {
        data: response,
        translateFunction,
        protocol,
        isErrorTextStraightToOutput,
        isBlobGetRequest: true,
        statusCode,
        error: false,
        additionalErrors: null,
        errorText: "",
      };
    } else if (protocol === requestProtocolsMap.pureRest) {
      return {
        error: !isResponseStatusSuccess,
        errorText: isResponseStatusSuccess ? "" : response.errorText,
        data: isResponseStatusSuccess ? { ...response } : {},
        additionalErrors: isResponseStatusSuccess
          ? null
          : response.additionalErrors,
        statusCode,
        translateFunction,
        protocol,
        isErrorTextStraightToOutput,
        isBlobGetRequest,
      };
    } else {
      return {
        ...response,
        translateFunction,
        protocol,
        isErrorTextStraightToOutput,
        isBlobGetRequest: false,
        statusCode,
      };
    }
  };

  makeFetch = <
    MakeFetchType extends IRequestParams &
      Partial<IJSONPRCRequestParams> & {
        requestProtocol: keyof typeof requestProtocolsMap;
      } & { method: string }
  >({
    id,
    version,
    headers,
    body,
    mode,
    method,
    endpoint,
    parseType,
    queryParams,
    responseSchema,
    requestProtocol,
    isErrorTextStraightToOutput,
    extraValidationCallback,
    translateFunction,
  }: MakeFetchType): Promise<IResponse> => {
    const formattedEndpoint = this.getFormattedEndpoint({
      endpoint,
      queryParams,
    });

    const fetchBody = this.getFetchBody({
      requestProtocol,
      body,
      version,
      method,
      id,
    });

    const { requestFetch, fetchController } = this.getIsomorphicFetch({
      endpoint: formattedEndpoint,
      fetchParams: {
        body: fetchBody,
        mode,
        headers,
        method,
      },
    });

    const request = requestFetch()
      .then(async (response: any) => {
        const statusValidator = new StatusValidator();
        const statusCode = response.status;
        const isStatusEmpty = statusCode === 204;
        const isResponseStatusSuccess: boolean = this.getIsResponseStatusSuccess(
          statusCode
        );
        const isValidStatus = statusValidator.getStatusIsFromWhiteList(
          statusCode
        );

        if (isValidStatus) {
          // any type because we did not know about data structure
          const respondedData: any = await this.parseResponseData({
            response,
            parseType,
            isResponseOk: isResponseStatusSuccess,
            isStatusEmpty
          });

          // validate the format of the request
          const formatDataTypeValidator = new FormatDataTypeValidator().getFormatValidateMethod(
            {
              protocol: requestProtocol,
              extraValidationCallback,
            }
          );

          // get the full validation result
          const isFormatValid: boolean = formatDataTypeValidator({
            response: respondedData,
            schema: responseSchema,
            prevId: id,
            isResponseStatusSuccess,
            isStatusEmpty
          });

          if (isFormatValid) {
            // get the formatter func
            const responseFormatter = new FormatResponseFactory().createFormatter(
              this.getPreparedResponseData({
                response: respondedData,
                translateFunction,
                protocol: requestProtocol,
                isErrorTextStraightToOutput,
                isBlobGetRequest: parseType === parseTypesMap.blob,
                statusCode,
                isResponseStatusSuccess,
              })
            );

            // format data
            const formattedResponseData = responseFormatter.getFormattedResponse();

            return formattedResponseData;
          }
        }

        // if not status from the whitelist - throw error with default error
        throw new Error(
          isErrorTextStraightToOutput ? response.statusText : NETWORK_ERROR_KEY
        );
      })
      .catch((error) => {
        console.error("(fetch-api): get error in the request", error.message);

        return new ErrorResponseFormatter().getFormattedErrorResponse({
          errorDictionaryParams: {
            translateFunction,
            errorTextKey: error.message,
            isErrorTextStraightToOutput,
          },
          statusCode: 500,
        });
      });

    return this.requestRacer({
      request,
      fetchController,
      translateFunction,
      isErrorTextStraightToOutput,
    });
  };

  requestRacer = ({
    request,
    fetchController,
    translateFunction,
    isErrorTextStraightToOutput,
  }: RequestRacerParams): Promise<IResponse> => {
    const timeoutException: Promise<IResponse> = new Promise((resolve) =>
      setTimeout(() => {
        const defaultError: IResponse = new ErrorResponseFormatter().getFormattedErrorResponse(
          {
            errorDictionaryParams: {
              translateFunction,
              errorTextKey: TIMEOUT_ERROR_KEY,
              isErrorTextStraightToOutput,
            },
            statusCode: 500,
          }
        );

        // if the window fetch
        if (typeof window !== "undefined") {
          fetchController.abort();
        }

        resolve(defaultError);
      }, TIMEOUT_VALUE)
    );

    return Promise.race([request, timeoutException]);
  };
}
