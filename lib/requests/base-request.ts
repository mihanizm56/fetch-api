import nodeFetch from "node-fetch";
import queryString from "query-string";
import { uniqueId } from "@/utils/unique-id";
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
  GetPureRestErrorTextParamsType,
  GetPureRestAdditionalErrorsParamsType,
  CustomSelectorDataType,
  cacheMap
} from "@/types";
import { isNode } from '@/utils/is-node';
import {
  parseTypesMap,
  requestProtocolsMap,
  NETWORK_ERROR_KEY,
  TIMEOUT_ERROR_KEY,
  ABORT_REQUEST_EVENT_NAME,
  NOT_FOUND_ERROR_KEY,
} from "@/constants/shared";
import { StatusValidator } from "../validators/response-status-validator";
import { FormatDataTypeValidator } from "../validators/response-type-validator";
import { ErrorResponseFormatter } from "../errors-formatter/error-response-formatter";
import { TIMEOUT_VALUE } from "../constants/timeout";
import { jsonParser } from "../utils/parsers/json-parser";
import { blobParser } from "../utils/parsers/blob-parser";
import { textParser } from "../utils/parsers/text-parser";
import { FormatResponseFactory } from "@/formatters/format-response-factory";
import { isFormData } from "@/utils/is-form-data";
import { progressParser } from "@/utils/parsers/progress-parser";
import { getDataFromSelector } from "@/utils/get-data-from-selector";

type GetFormattedHeadersParamsType = {
  body: JSON | FormData,
  headers?: {
    [key: string]: any;
  }
}

type AbortListenersParamsType = {
  fetchController: AbortController;
  abortRequestId: string;
}

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

  addAbortListenerToRequest: (params: AbortListenersParamsType) => void;

  abortRequestListener?: any
}



export class BaseRequest implements IBaseRequests {
  abortRequestListener: any = null

  parseResponseData = async ({
    response,
    parseType,
    isResponseOk,
    isStatusEmpty,
    isNotFound,
    progressOptions
  }: ParseResponseParams) => {
    try {
      if (isStatusEmpty) {
        return {}
      }

      if (isNotFound) {
        try {
          return await jsonParser(response)
        } catch {
          return {
            error: true,
            errorText: NOT_FOUND_ERROR_KEY,
            data: null,
            additionalErrors: null
          }
        }
      }

      // if not "not ok" status then always get json format
      if (!isResponseOk) {
        return await jsonParser(response);
      }

      // progress not run on nodejs yet
      if (progressOptions && parseType && !isNode()) {
        return await progressParser({
          response,
          progressOptions,
          parseType
        })
      }

      if (parseType === parseTypesMap.json) {
        return await jsonParser(response);
      }

      if (parseType === parseTypesMap.blob) {
        return await blobParser(response);
      }

      if (parseType === parseTypesMap.text) {
        return await textParser(response);
      }
    } catch (error) {
      console.error('(fetch-api): can not parse the response', error);

      throw new Error(NETWORK_ERROR_KEY)
    }
  };

  addAbortListenerToRequest = ({ fetchController, abortRequestId }: AbortListenersParamsType) => {
    if (!this.abortRequestListener) {
      this.abortRequestListener = (event: CustomEvent) => {
        if (event.detail && event.detail.id === abortRequestId) {
          fetchController.abort()
        }
      }
    }

    document.addEventListener(ABORT_REQUEST_EVENT_NAME, this.abortRequestListener, true)
  };

  removeAbortListenerToRequest = () => {
    if (this.abortRequestListener) {
      document.removeEventListener(ABORT_REQUEST_EVENT_NAME, this.abortRequestListener, true)
      this.abortRequestListener = null
    }
  };


  // get an isomorfic fetch
  getIsomorphicFetch = ({
    endpoint,
    fetchParams,
    abortRequestId,
  }: GetIsomorphicFetchParamsType): GetIsomorphicFetchReturnsType => {
    if (isNode()) {
      const requestFetch = (nodeFetch.bind(
        // eslint-disable-line
        null,
        endpoint,
        { ...fetchParams }
      ) as () => Promise<unknown>) as () => Promise<IResponse>;

      return { requestFetch };
    }

    const fetchController = new AbortController();

    // set the cancel request listener
    if (abortRequestId) {
      this.addAbortListenerToRequest({
        abortRequestId,
        fetchController,
      })
    }

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
    arrayFormat
  }: FormattedEndpointParams): string => {
    if (queryParams) {
      return `${endpoint}?${queryString.stringify(queryParams, {
        arrayFormat: arrayFormat || 'none'
      })}`;
    }

    return endpoint;
  };

  // get formatted fetch body in needed
  getFetchBody = ({
    requestProtocol,
    body,
    method,
    version,
    id,
    isBatchRequest
  }: GetFetchBodyParamsType) => {
    if (method === "GET") {
      return undefined;
    }

    if (requestProtocol === requestProtocolsMap.jsonRpc) {
      if (isBatchRequest) {
        return JSON.stringify(body)
      }

      return JSON.stringify({ ...body, ...version, id });
    }


    if (isFormData(body)) {
      return body;
    } else {
      return JSON.stringify(body);
    }
  };

  getFormattedHeaders = ({ body, headers }: GetFormattedHeadersParamsType) =>
    isFormData(body)
      ? headers
      : ({
        "Content-type": "application/json",
        ...headers
      })

  getPureRestErrorText = ({
    response,
    isResponseStatusSuccess
  }: GetPureRestErrorTextParamsType) => {
    const { error, errorText } = response;

    if (isResponseStatusSuccess) {
      return ''
    }

    if (typeof errorText === 'string') {
      return errorText;
    }

    if (typeof error === 'string') {
      return error;
    }

    return '';
  }

  getPureRestAdditionalErrors = ({
    response,
    isResponseStatusSuccess
  }: GetPureRestAdditionalErrorsParamsType) => {
    const { additionalErrors, errorText, ...restResponce } = response;

    if (isResponseStatusSuccess) {
      return null;
    }

    if (additionalErrors) {
      return additionalErrors;
    }

    // if backend wont give us a special field for error parameters
    return restResponce;
  }

  // TODO REFACTOR THIS FORMATTING!!!!!!
  getPreparedResponseData = ({
    response,
    translateFunction,
    protocol,
    isErrorTextStraightToOutput,
    statusCode,
    isResponseStatusSuccess,
    parseType,
    isBatchRequest,
    responseSchema,
    body
  }: GetPreparedResponseDataParams): FormatResponseParamsType => {
    if (parseType === 'blob' || parseType === 'text') {
      return {
        data: response,
        translateFunction,
        protocol,
        isErrorTextStraightToOutput,
        parseType,
        statusCode,
        error: false,
        additionalErrors: null,
        errorText: "",
      };
    }

    if (protocol === requestProtocolsMap.pureRest) {
      const error = !isResponseStatusSuccess
      const errorText = this.getPureRestErrorText({ response, isResponseStatusSuccess });
      const data = isResponseStatusSuccess ? response : {};
      const additionalErrors = this.getPureRestAdditionalErrors({ response, isResponseStatusSuccess })

      return {
        error,
        errorText,
        data,
        additionalErrors,
        statusCode,
        translateFunction,
        protocol,
        isErrorTextStraightToOutput,
        parseType,
      };
    }

    if (isBatchRequest) {
      return {
        translateFunction,
        protocol,
        isErrorTextStraightToOutput,
        statusCode,
        parseType: parseTypesMap.json,
        data: response,
        isBatchRequest,
        responseSchema,
        body
      }
    }

    return {
      ...response,
      translateFunction,
      protocol,
      isErrorTextStraightToOutput,
      isBlobGetRequest: false,
      statusCode,
    };
  };

  getSelectedResponse = ({
    response,
    customSelectorData,
    selectData
  }: {
    response: IResponse,
    customSelectorData?: CustomSelectorDataType,
    selectData?: string
  }): IResponse => {
    if (selectData) {
      const dataFromSelector = getDataFromSelector({ selectData, responseData: response.data })

      return { ...response, data: dataFromSelector };
    }

    const dataFromCustomSelector = customSelectorData && response.data
      ? customSelectorData(response.data)
      : response.data;

    return { ...response, data: dataFromCustomSelector };
  }

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
    parseType = parseTypesMap.json,
    queryParams,
    responseSchema,
    requestProtocol,
    isErrorTextStraightToOutput,
    extraValidationCallback,
    translateFunction,
    customTimeout,
    abortRequestId,
    arrayFormat,
    isBatchRequest,
    progressOptions,
    customSelectorData,
    selectData,
    cache = cacheMap.default, // TODO проверить нужен ли дефолтный параметр
  }: MakeFetchType): Promise<IResponse> => {
    const formattedEndpoint = this.getFormattedEndpoint({
      endpoint,
      queryParams,
      arrayFormat
    });

    const formattedHeaders = this.getFormattedHeaders({
      body,
      headers
    })

    const fetchBody = this.getFetchBody({
      requestProtocol,
      body,
      version,
      method,
      id,
      isBatchRequest
    });

    const { requestFetch, fetchController } = this.getIsomorphicFetch({
      endpoint: formattedEndpoint,
      abortRequestId,
      fetchParams: {
        body: fetchBody,
        mode,
        headers: formattedHeaders,
        method,
        cache
      },
    });

    const request = requestFetch()
      .then(async (response: any) => {
        const statusValidator = new StatusValidator();
        const statusCode = response.status;
        const isStatusEmpty = statusCode === 204;
        const isNotFound = statusCode === 404;
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
            isStatusEmpty,
            isNotFound,
            progressOptions
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
            isStatusEmpty,
            isBatchRequest
          });

          if (isFormatValid) {
            // get the formatter func
            const responseFormatter = new FormatResponseFactory().createFormatter(
              this.getPreparedResponseData({
                response: respondedData,
                translateFunction,
                protocol: requestProtocol,
                isErrorTextStraightToOutput,
                parseType,
                statusCode,
                isResponseStatusSuccess,
                isBatchRequest,
                responseSchema,
                body
              })
            );

            // format data
            const formattedResponseData = responseFormatter.getFormattedResponse();

            // select the response data fields if all fields are not necessary
            const selectedResponseData = this.getSelectedResponse({
              response: formattedResponseData,
              customSelectorData,
              selectData
            });

            // remove the abort listener
            this.removeAbortListenerToRequest();

            return selectedResponseData;
          }
        }

        // if not status from the whitelist - throw error with default error
        throw new Error(
          isErrorTextStraightToOutput ? response.statusText : NETWORK_ERROR_KEY
        );
      })
      .catch((error) => {
        console.error("(fetch-api): get error in the request", endpoint);
        console.group("Show error data");
        console.error("(fetch-api): message:", error.message);
        console.error("(fetch-api): endpoint:", endpoint);
        console.error("(fetch-api): body params:", fetchBody);
        console.groupEnd();

        // remove the abort listener
        this.removeAbortListenerToRequest()

        return new ErrorResponseFormatter().getFormattedErrorResponse({
          errorDictionaryParams: {
            translateFunction,
            errorTextKey: error.message,
            isErrorTextStraightToOutput,
            statusCode: 500
          },
          statusCode: 500,
        });
      });

    return this.requestRacer({
      request,
      fetchController,
      translateFunction,
      isErrorTextStraightToOutput,
      customTimeout
    });
  };

  requestRacer = ({
    request,
    fetchController,
    translateFunction,
    isErrorTextStraightToOutput,
    customTimeout
  }: RequestRacerParams): Promise<IResponse> => {
    const timeoutException: Promise<IResponse> = new Promise((resolve) =>
      setTimeout(() => {
        const defaultError: IResponse = new ErrorResponseFormatter().getFormattedErrorResponse(
          {
            errorDictionaryParams: {
              translateFunction,
              errorTextKey: TIMEOUT_ERROR_KEY,
              isErrorTextStraightToOutput,
              statusCode: 500
            },
            statusCode: 500,
          }
        );

        // if the window fetch
        if (!isNode()) {
          fetchController.abort();
        }

        resolve(defaultError);
      }, customTimeout || TIMEOUT_VALUE)
    );

    return Promise.race([request, timeoutException]);
  };
}
