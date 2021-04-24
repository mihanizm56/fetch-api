import nodeFetch from "node-fetch";
import queryString from "query-string";
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
  PersistentFetchParamsType,
  AbortListenersParamsType,
  GetFormattedHeadersParamsType,
  GetFilteredDefaultErrorMessageParamsType,
  SetResponseTrackOptions,
  TraceBaseRequestParamsType,
  SetResponseTrackCallbackOptions
} from "@/types";
import { isNode } from '@/utils/is-node';
import {
  parseTypesMap,
  requestProtocolsMap,
  NETWORK_ERROR_KEY,
  TIMEOUT_ERROR_KEY,
  ABORT_REQUEST_EVENT_NAME,
  NOT_FOUND_ERROR_KEY,
  cacheMap,
} from "@/constants";
import { FormatDataTypeValidator } from "../validators/response-type-validator";
import { ErrorResponseFormatter } from "../errors-formatter/error-response-formatter";
import { TIMEOUT_VALUE } from "@/constants";
import { FormatResponseFactory } from "@/formatters/format-response-factory";
import { isFormData } from "@/utils/is-form-data";
import { getDataFromSelector } from "@/utils/get-data-from-selector";
import { OFFLINE_STATUS_CODE, REQUEST_ERROR_STATUS_CODE } from "@/constants";
import { makeErrorRequestLogs } from "@/utils/make-error-request-logs";
import { getIsRequestOnline } from "@/utils/get-is-request-online";
import { ResponseDataParserFactory } from "@/utils/parsers/response-data-parser-factory";
import { getErrorTracingType } from "@/utils/tracing/get-error-tracing-type";
import { getResponseHeaders } from "@/utils/tracing/get-response-headers";
import { ResponseStatusValidator } from "@/validators/response-status-validator";
import { checkToDoRetry } from "@/utils/check-todo-retry";

interface IBaseRequest {
  makeFetch: (
    values: IRequestParams &
      IJSONPRCRequestParams & {
        requestProtocol: keyof typeof requestProtocolsMap;
      } & { method: Pick<RequestInit,'method'>; }
  ) => Promise<IResponse>;

  requestRacer: (params: RequestRacerParams) => Promise<any>;

  parseResponseData: (data: ParseResponseParams) => any;

  getIsomorphicFetch: (
    params: GetIsomorphicFetchParamsType
  ) => GetIsomorphicFetchReturnsType;

  addAbortListenerToRequest: (params: AbortListenersParamsType) => void;

  abortRequestListener?: any

  getFormattedEndpoint:(params: FormattedEndpointParams) => string;

  getFetchBody: (params: GetFetchBodyParamsType) => any

  getFormattedHeaders:(options: GetFormattedHeadersParamsType) => Record<string,string> | undefined;
}

export class BaseRequest implements IBaseRequest {
  abortRequestListener: any = null; // TODO FIX ANY
  response: Response | null = null;
  parsedResponseData: any = null;
  statusCode: number = 0;
  fetchParams?: RequestInit & Pick<IRequestParams, 'headers'> & {endpoint: string};
  validationError:boolean = false;
  cookie: string = '';

  static dependencies: Record<string, any>

  static persistentOptions?: PersistentFetchParamsType;

  static responseTrackCallbacks: Array<SetResponseTrackOptions> = [];

  parseResponseData = async ({
    response,
    parseType,
    isResponseStatusSuccess,
    isStatusEmpty,
    isNotFound,
    progressOptions
  }: ParseResponseParams) => {
    try {
      if (isStatusEmpty) {
        return {}
      }

      const responseDataParser = new ResponseDataParserFactory().getParser({
        parseType,
        isResponseStatusSuccess,
        isNotFound,
        progressOptions
      })      

      if (isNotFound) {
        try {
          return await responseDataParser.parse(response)
        } catch {          
          return {
            error: true,
            errorText: NOT_FOUND_ERROR_KEY,
            data: null,
            additionalErrors: null
          }
        }
      }

      return await responseDataParser.parse(response)
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

  removeAbortListenerFromRequest = () => {
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
    const requestParams = BaseRequest.persistentOptions 
      ? {...fetchParams,...BaseRequest.persistentOptions} 
      : fetchParams;

    if (isNode()) {
      const requestFetch = (
        () => nodeFetch(endpoint,requestParams) as unknown
      ) as () => Promise<Response>

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

    const requestFetch = window.fetch.bind(null, endpoint, {
      ...requestParams,
      signal: fetchController.signal,
    })

    return {
      requestFetch,
      fetchController,
    };
  };

  // get serialized endpoint
  getFormattedEndpoint = ({
    endpoint,
    queryParams,
    arrayFormat
  }: FormattedEndpointParams): string => {
    if(!queryParams){
      return endpoint;
    }

    return `${endpoint}?${queryString.stringify(queryParams, {
      arrayFormat: arrayFormat || 'none'
    })}`;
  };

  getFilteredDefaultErrorMessage = ({
    response, 
    isErrorTextStraightToOutput}: GetFilteredDefaultErrorMessageParamsType): string => {
    // if awaiting the pure response from fetch
    if(isErrorTextStraightToOutput && 
        typeof response.statusText === 'string' && 
        response.statusText.trim() && 
        response.statusText.trim() !== 'OK'
      ){
        return response.statusText;
      }

    return NETWORK_ERROR_KEY;
  }

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

  getFormattedHeaders = ({ body, headers = {}, isPureFileRequest }: GetFormattedHeadersParamsType):Record<string,string> => {
    if(isPureFileRequest || isFormData(body)){
      return headers
    }

    return {
      "Content-type": "application/json",
      ...headers
    }
  }

  // TODO REFACTOR THIS FORMATTING!!!!!!
  getPreparedResponseData = ({
    response,
    translateFunction,
    protocol,
    isErrorTextStraightToOutput,
    statusCode,
    parseType,
    isBatchRequest,
    responseSchema,
    body,
    isNotFound,
    isPureFileRequest
  }: GetPreparedResponseDataParams): FormatResponseParamsType => {
    if (isPureFileRequest && !isNotFound) {
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
      return {
        data:response, 
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
      statusCode,
    };
  };

  traceBaseRequest = (
    {
      traceRequestCallback,
      response,
      requestError,
      validationError,
      responseError,
      requestCookies,
      requestBody,
      requestHeaders,
      responseBody,
      formattedResponse,
      endpoint,
      method,
      code,
      tracingDisabled
    }: TraceBaseRequestParamsType) => {    
    // special check if we need to configure tracking object
    if((!BaseRequest.responseTrackCallbacks.length && !traceRequestCallback) || !response || tracingDisabled){
      return;
    }

    const {responseHeaders,responseCookies} = getResponseHeaders(response);

    const errorType = getErrorTracingType({
      requestError,
      responseError,
      validationError
    });
    
    const error = requestError || validationError || responseError || false;

    const options: SetResponseTrackCallbackOptions = {
      endpoint,
      method,
      requestBody,
      requestHeaders,
      requestCookies,
      response,
      responseBody,
      formattedResponse,
      responseHeaders,
      responseCookies,
      error,
      errorType,
      code
    }

    BaseRequest.responseTrackCallbacks.forEach(({callback})=>{
      callback(options)
    });

    // fire special tracing request callback (for each request separately)
    if(traceRequestCallback) {
      traceRequestCallback(options)
    }
  }


  makeFetch = <
    MakeFetchType extends IRequestParams &
    Partial<IJSONPRCRequestParams> & {
      requestProtocol: keyof typeof requestProtocolsMap;
    } & { method: Pick<RequestInit,'method'> }
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
    cache = cacheMap.default, // TODO проверить нужен ли дефолтный параметр,
    credentials,
    integrity,
    keepalive,
    redirect,
    referrer,
    referrerPolicy,
    retry,
    traceRequestCallback,
    tracingDisabled,
    pureJsonFileResponse,
    extraVerifyRetry
  }: MakeFetchType): Promise<IResponse> => {
    const isPureFileRequest = parseType === parseTypesMap.blob || parseType === parseTypesMap.text || Boolean(pureJsonFileResponse);

    // set cookie to get them in trace functions
    this.cookie = global.document ? global.document.cookie : '';

    const formattedEndpoint = this.getFormattedEndpoint({
      endpoint,
      queryParams,
      arrayFormat
    });

    const formattedHeaders = this.getFormattedHeaders({
      body,
      headers,
      isPureFileRequest
    });

    const fetchBody = this.getFetchBody({
      requestProtocol,
      body,
      version,
      method,
      id,
      isBatchRequest
    });

    const fetchParams = {
      endpoint: formattedEndpoint,
      body: fetchBody,
      mode,
      headers: formattedHeaders,
      method,
      cache,
      credentials,
      integrity,
      keepalive,
      redirect,
      referrer,
      referrerPolicy,
    }

    const { requestFetch, fetchController } = this.getIsomorphicFetch({
      endpoint: formattedEndpoint,
      abortRequestId,
      fetchParams
    });

    const getRequest = (retryCounter?: number): Promise<IResponse> => requestFetch()
      .then(async (response: Response) => {
        this.statusCode = response.status;
        const isStatusEmpty = this.statusCode === 204;
        const isNotFound = this.statusCode === 404;        
        
        // check for different types of requests - is status valid or not
        const statusValidator = new ResponseStatusValidator().getFormatValidateMethod({
          requestProtocol,
          isBatchRequest,
          isPureFileRequest,
          status: this.statusCode,
        })

        const isValidStatus = statusValidator();

        const isResponseStatusSuccess = ResponseStatusValidator.getIsStatusCodeSuccess(this.statusCode);

        // add response to Request class to share if an error exist
        // if the request will crash - there will be null
        // if not - there will be pure response object
        this.response = response;

        if (isValidStatus) {
          // any type because we did not know about data structure
          const parsedResponseData: any = await this.parseResponseData({
            response,
            parseType,
            isResponseStatusSuccess,
            isStatusEmpty,
            isNotFound,
            progressOptions
          });          
          this.parsedResponseData = parsedResponseData;

          // validate the format of the request
          const formatDataTypeValidator = new FormatDataTypeValidator().getFormatValidateMethod(
            {
              protocol: requestProtocol,
              extraValidationCallback,
              responseSchema
            }
          );

          // get the full validation result
          const isFormatValid: boolean = formatDataTypeValidator({
            response: parsedResponseData,
            schema: responseSchema,
            prevId: id,
            isResponseStatusSuccess,
            isStatusEmpty,
            isBatchRequest,
            isPureFileRequest,
          });         

          if (isFormatValid) {
            // get the formatter func
            const responseFormatter = new FormatResponseFactory().createFormatter(
              this.getPreparedResponseData({
                isPureFileRequest,
                response: parsedResponseData,
                translateFunction,
                protocol: requestProtocol,
                isErrorTextStraightToOutput,
                parseType,
                statusCode: this.statusCode,
                isBatchRequest,
                responseSchema,
                body,
                isNotFound
              })
            );

            // format data
            const formattedResponseData = responseFormatter.getFormattedResponse();

            // check if needs to retry request     
            const needsToRetry = checkToDoRetry({
              formattedResponseData,
              retry,
              retryCounter,
              extraVerifyRetry
            })

            if(needsToRetry && typeof retryCounter !== 'undefined'){
              return getRequest(retryCounter + 1)
            }
 
            // select the response data fields if all fields are not necessary
            // work only for json responses
            const selectedResponseData = (selectData || customSelectorData) && !isPureFileRequest 
              ? getDataFromSelector({ selectData, responseData: formattedResponseData, customSelectorData }) 
              : formattedResponseData;

            // remove the abort listener
            this.removeAbortListenerFromRequest();

            this.traceBaseRequest({
              traceRequestCallback,
              response,
              responseError: formattedResponseData.error,
              requestCookies:this.cookie,
              requestBody:fetchParams.body,
              requestHeaders:fetchParams.headers,
              responseBody: parsedResponseData,
              formattedResponse: formattedResponseData,
              endpoint,
              method,
              code: this.statusCode,
              tracingDisabled
            })

            // return data
            return selectedResponseData;
          }

          this.validationError = true;
        }

        // if a status is above 500 or response not valid or response.statusText is empty 
        // throw an error with default error message
        const validationErrorMessage = this.getFilteredDefaultErrorMessage({response, isErrorTextStraightToOutput});

        throw new Error(validationErrorMessage);
      })
      .catch((error: Error) => {
        const errorRequestMessage = isErrorTextStraightToOutput ? error.message : NETWORK_ERROR_KEY;
        
        // check if needs to retry request   
        if (typeof retry !== 'undefined' &&  typeof retryCounter !== 'undefined' &&  retryCounter < retry) {
          return getRequest(retryCounter + 1)
        }

        // make error logs
        makeErrorRequestLogs({
          endpoint,
          errorRequestMessage,
          fetchBody,
        });

        // remove the abort listener
        this.removeAbortListenerFromRequest();

        const isOnlineRequest = getIsRequestOnline()
        const errorCode = isOnlineRequest ? REQUEST_ERROR_STATUS_CODE : OFFLINE_STATUS_CODE;
        
        const formattedResponseError = new ErrorResponseFormatter().getFormattedErrorResponse({
          errorDictionaryParams: {
            translateFunction,
            errorTextKey: errorRequestMessage,
            isErrorTextStraightToOutput,
            statusCode: errorCode
          },
          statusCode: errorCode,
        })        

        this.traceBaseRequest({
          validationError: this.validationError,
          traceRequestCallback,
          response: this.response,
          requestError: true,
          requestCookies:this.cookie,
          requestBody:fetchParams.body,
          requestHeaders:fetchParams.headers,
          responseBody: this.parsedResponseData,
          formattedResponse: formattedResponseError,
          endpoint,
          method,
          code: this.statusCode,
          tracingDisabled
        })

        return formattedResponseError
      });

    return this.requestRacer({
      request: getRequest(1),
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
        const requestTimeoutError: IResponse = new ErrorResponseFormatter().getFormattedErrorResponse(
          {
            errorDictionaryParams: {
              translateFunction,
              errorTextKey: TIMEOUT_ERROR_KEY,
              isErrorTextStraightToOutput,
              statusCode: REQUEST_ERROR_STATUS_CODE
            },
            statusCode: REQUEST_ERROR_STATUS_CODE,
          }
        );

        // if the window fetch
        if (!isNode()) {
          fetchController.abort();
        }

        resolve(requestTimeoutError);
      }, customTimeout || TIMEOUT_VALUE)
    );

    return Promise.race([request, timeoutException]);
  };
}
