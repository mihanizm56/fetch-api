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
  GetPureRestErrorTextParamsType,
  GetPureRestAdditionalErrorsParamsType
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
import { textParser } from "../utils/parsers/text-parser";
import { objectToQueryString } from "../utils/object-to-query-string";
import { FormatResponseFactory } from "@/formatters/format-response-factory";
import { isFormData } from "@/utils/is-form-data";

type GetFormattedHeadersParamsType = {
  body:JSON|FormData,
  headers?:{
    [key:string]:any;
  }
}

type AbortListenersParamsType = {
  fetchController: AbortController;
  abortSectionId: string;
  eventNameToCancelTheRequest: string;
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

  addAbortListenerToRequest:(params:AbortListenersParamsType) => void;
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

      case parseTypesMap.text:
        return textParser(response);

      // default parse to json
      default:
        return jsonParser(response);
    }
  };

  addAbortListenerToRequest = ({fetchController, abortSectionId, eventNameToCancelTheRequest}: AbortListenersParamsType) => 
    document.addEventListener(eventNameToCancelTheRequest, 
      (event: CustomEvent) => {
        if (event.detail && event.detail.abortSectionId === abortSectionId) {
          fetchController.abort()
        }
    })

  // get an isomorfic fetch
  getIsomorphicFetch = ({
    endpoint,
    fetchParams,
    abortSectionId,
    eventNameToCancelTheRequest
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

    // set the cancel request listener
    if(eventNameToCancelTheRequest && abortSectionId){
      this.addAbortListenerToRequest({
        abortSectionId,
        fetchController,
        eventNameToCancelTheRequest
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
      if (isFormData(body)) {
        return body;
      } else {
        return JSON.stringify(body);
      }
    }
  };

  getFormattedHeaders = ({body,headers}:GetFormattedHeadersParamsType) => 
    isFormData(body) 
      ? headers
      : ({
        "Content-type":"application/json",
        ...headers
      })

  getPureRestErrorText = ({
    response,
    isResponseStatusSuccess
  }: GetPureRestErrorTextParamsType) => {
    const { error, errorText } = response;

    if(isResponseStatusSuccess){
      return ''
    }

    if(typeof errorText === 'string'){
      return errorText;
    }

    if(typeof error === 'string'){
      return error;
    }

    return '';
  }

  getPureRestAdditionalErrors = ({
    response,
    isResponseStatusSuccess
  }: GetPureRestAdditionalErrorsParamsType) => {
    const { additionalErrors, errorText, ...restResponce } = response;

    if(isResponseStatusSuccess){
      return null;
    }

    if(additionalErrors) {
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
    parseType
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
      const errorText = this.getPureRestErrorText({response, isResponseStatusSuccess});
      const data = isResponseStatusSuccess ? response : {};
      const additionalErrors = this.getPureRestAdditionalErrors({response, isResponseStatusSuccess})


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

    return {
      ...response,
      translateFunction,
      protocol,
      isErrorTextStraightToOutput,
      isBlobGetRequest: false,
      statusCode,
    };
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
    parseType = parseTypesMap.json,
    queryParams,
    responseSchema,
    requestProtocol,
    isErrorTextStraightToOutput,
    extraValidationCallback,
    translateFunction,
    customTimeout,
    eventNameToCancelTheRequest,
    abortSectionId
  }: MakeFetchType): Promise<IResponse> => {
    const formattedEndpoint = this.getFormattedEndpoint({
      endpoint,
      queryParams,
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
    });

    const { requestFetch, fetchController } = this.getIsomorphicFetch({
      endpoint: formattedEndpoint,
      abortSectionId,
      eventNameToCancelTheRequest,
      fetchParams: {
        body: fetchBody,
        mode,
        headers:formattedHeaders,
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
                parseType,
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
            },
            statusCode: 500,
          }
        );

        // if the window fetch
        if (typeof window !== "undefined") {
          fetchController.abort();
        }

        resolve(defaultError);
      }, customTimeout || TIMEOUT_VALUE)
    );

    return Promise.race([request, timeoutException]);
  };
}
