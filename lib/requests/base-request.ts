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
  AbortListenersParamsType,
  GetFormattedHeadersParamsType,
  GetFilteredDefaultErrorMessageParamsType,
  SetResponseTrackOptions,
  TraceBaseRequestParamsType,
  SetResponseTrackCallbackOptions,
  SetResponsePersistentParamsOptions,
  GetMiddlewareCombinedResponseParamsType,
  MiddlewareParams,
  GetTimeoutExceptionParamsType,
  ICache,
  SetResponseFromCacheParamsType,
  GetResponseFromCacheParamsType,
  GetFetchParamsType
} from "@/types";
import { getIsNode } from '@/utils/is-node';
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
import { OFFLINE_STATUS_CODE, REQUEST_ERROR_STATUS_CODE } from "@/constants";
import { makeErrorRequestLogs } from "@/utils/make-error-request-logs";
import { getIsRequestOnline } from "@/utils/get-is-request-online";
import { ResponseDataParserFactory } from "@/utils/parsers/response-data-parser-factory";
import { getErrorTracingType } from "@/utils/tracing/get-error-tracing-type";
import { getResponseHeaders } from "@/utils/tracing/get-response-headers";
import { ResponseStatusValidator } from "@/validators/response-status-validator";
import { checkToDoRetry } from "@/utils/check-todo-retry";
import { HeadersFormatter } from "@/formatters/headers-formatter";
import { getSleepTimeBeforeRetry } from "@/utils/get-sleep-time-before-retry";
import { sleep } from "@/utils/sleep";
import { getIsAbortRequestError } from "@/utils/get-is-abort-request-error";

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
  validationError: boolean = false;
  cookie: string = '';
  responseHeaders: Record<string,string> = {}

  static dependencies: Record<string, any>

  static persistentOptionsGetters: Array<SetResponsePersistentParamsOptions> = [];

  static responseTrackCallbacks: Array<SetResponseTrackOptions> = [];

  static middlewares: Array<MiddlewareParams> = [];

  static cache?: ICache;

  parseResponseData = async ({
    response,
    parseType,
    isResponseStatusSuccess,
    isStatusEmpty,
    isNotFound,
    progressOptions,
    requestProtocol
  }: ParseResponseParams) => {
    try {
      if (isStatusEmpty && requestProtocol !== requestProtocolsMap.jsonRpc) {
        return {}
      }

      const responseDataParser = new ResponseDataParserFactory().getParser({
        parseType,
        isResponseStatusSuccess,
        isNotFound,
        progressOptions,
        isNode: getIsNode()
      });

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
    } catch (error: any) {
      // there may be the situation when response was given but aborted during parsing
      // and we should not throw NETWORK_ERROR_KEY
      // but throw pure error to be cathed in .catch block below with necessary logs
      const userAbortedRequest = getIsAbortRequestError(error.message);

      if(userAbortedRequest) {
        console.error('CHECK',error.message);
        
        throw new Error(error);
      }

      // regular error catching
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

  getFetchParams = ({
    proxyPersistentOptionsAreDisabled,
    params
  }: GetFetchParamsType): RequestInit => {
    if(!BaseRequest.persistentOptionsGetters?.length || proxyPersistentOptionsAreDisabled) {
      return params;
    }

    return BaseRequest.persistentOptionsGetters.reduce((acc:RequestInit, { callback }) => {
      const persistentRequestParams = callback(params);
      
      return { 
        ...acc, 
        ...persistentRequestParams,
        headers: {
          ...acc.headers,
          ...persistentRequestParams.headers
        }};
    }, params);
  }

  // get an isomorfic fetch
  getIsomorphicFetch = ({
    endpoint,
    fetchParams,
    abortRequestId,
    proxyPersistentOptionsAreDisabled
  }: GetIsomorphicFetchParamsType): GetIsomorphicFetchReturnsType => {
    const requestParams = this.getFetchParams({
      params:fetchParams,
      proxyPersistentOptionsAreDisabled
    });

    // if old nodejs
    if (typeof fetch === 'undefined') {
      const requestFetch = (
        // TODO fix any type
        () => nodeFetch(endpoint, requestParams as any) as unknown
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

  getMiddlewareCombinedResponse = async ({
      middlewaresAreDisabled,
      response,
      ...middlewareParams}:GetMiddlewareCombinedResponseParamsType
  ): Promise<IResponse> => {
    // todo middleware per each request
    // if((!BaseRequest.middlewares.length && !requestMiddleware) || params.middlewaresAreDisabled){
    if (!BaseRequest.middlewares.length ||  middlewaresAreDisabled) {
      return response;
    }

    return await BaseRequest.middlewares.reduce(async (acc: Promise<IResponse> | IResponse, middleware: MiddlewareParams)=>{
      const awaitedAcc = await acc;

      const result = await middleware.middleware({
        ...middlewareParams,
        response: awaitedAcc
      });

      return result;
    }, response);
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
    responseHeaders,
    parseType,
    isBatchRequest,
    responseSchema,
    body,
    isNotFound,
    isPureFileRequest,
    ignoreResponseIdCompare
  }: GetPreparedResponseDataParams): FormatResponseParamsType => {
    if (isPureFileRequest && !isNotFound) {
      return {
        data: response,
        translateFunction,
        protocol,
        isErrorTextStraightToOutput,
        parseType,
        responseHeaders,
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
        responseHeaders,
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
        responseHeaders,
        parseType: parseTypesMap.json,
        data: response,
        isBatchRequest,
        responseSchema,
        body,
        ignoreResponseIdCompare
      }
    }

    return {
      ...response,
      translateFunction,
      protocol,
      isErrorTextStraightToOutput,
      statusCode,
      responseHeaders
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
      tracingDisabled,
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
      code,
    }

    BaseRequest.responseTrackCallbacks.forEach(({callback})=>{
      callback(options)
    });

    // fire special tracing request callback (for each request separately)
    if(traceRequestCallback) {
      traceRequestCallback(options)
    }
  }

  getResponseFromCache = async({
    endpoint,
    method,
    requestBody,
    requestHeaders,
    requestCookies,
    cacheIsDisabled,
    cacheNoStore,
    requestCache,
    fullEndpoint
  }: GetResponseFromCacheParamsType) => {
    if(cacheNoStore || cacheIsDisabled) {
      return;
    }

    const cache = requestCache || BaseRequest.cache;

    const cachedResponse = await cache?.getFromCache({
      endpoint,
      method,
      requestBody,
      requestHeaders,
      requestCookies,
      fullEndpoint
    });

    return cachedResponse;
  }

  setResponseToCache = ({
    endpoint,
    method,
    requestBody,
    requestHeaders,
    requestCookies,
    cacheIsDisabled,
    cacheNoStore,
    requestCache,
    response,
    fullEndpoint
  }: SetResponseFromCacheParamsType) => {
    if(cacheNoStore || cacheIsDisabled) {
      return;
    }

    const cache = requestCache || BaseRequest.cache;

    const cachedResponse = cache?.setToCache({
      endpoint,
      method,
      requestBody,
      requestHeaders,
      requestCookies,
      response,
      fullEndpoint
    });

    return cachedResponse;
  }

  makeFetch = <
    MakeFetchType extends IRequestParams &
    Partial<IJSONPRCRequestParams> & {
      requestProtocol: keyof typeof requestProtocolsMap;
    } & { method: Pick<RequestInit,'method'> }
  >(mainParams: MakeFetchType): Promise<IResponse> => {
    const {
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
      extraVerifyRetry,
      retryTimeInterval,
      retryIntervalNonIncrement,
      middlewaresAreDisabled,
      proxyPersistentOptionsAreDisabled,
      cacheIsDisabled,
      requestCache,
      ignoreResponseIdCompare,
      notRetryWhenOffline,
    } = mainParams;

    const isPureFileRequest = parseType === parseTypesMap.blob || 
      parseType === parseTypesMap.text || 
      Boolean(pureJsonFileResponse);

    const cacheNoStore = cache === 'no-store' || cache ==='no-cache';

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
      parseType
    };

    const { requestFetch, fetchController } = this.getIsomorphicFetch({
      endpoint: formattedEndpoint,
      abortRequestId,
      fetchParams,
      proxyPersistentOptionsAreDisabled
    });

    const getRequest = async (retryCounter?: number): Promise<IResponse> => {
      // waiting time before to make the retry
      // some cases need to be done with incremental timeout before retry, some are not
      const sleepTime = getSleepTimeBeforeRetry({
        retry,
        retryCounter,
        retryTimeInterval,
        retryIntervalNonIncrement
      });

      const cachedResponse = await this.getResponseFromCache({
        endpoint,
        method,
        requestBody: fetchParams.body,
        requestHeaders: fetchParams.headers,
        requestCookies: this.cookie,
        cacheIsDisabled,
        cacheNoStore: cacheNoStore,
        requestCache,
        fullEndpoint:formattedEndpoint
      });

      if (cachedResponse) {
        return cachedResponse;
      }

      return requestFetch()
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

        // transform responded headers to the object
        // this.responseHeaders = new HeadersFormatter(response.headers).getFormattedValue();
        this.responseHeaders = new HeadersFormatter(response.headers).getFormattedValue();

        if (isValidStatus) {
          // any type because we did not know about data structure
          const parsedResponseData: any = await this.parseResponseData({
            response,
            parseType,
            isResponseStatusSuccess,
            isStatusEmpty,
            isNotFound,
            progressOptions,
            requestProtocol
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
            ignoreResponseIdCompare,
            requestBody: body,
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
                responseHeaders: this.responseHeaders,
                isBatchRequest,
                responseSchema,
                body,
                isNotFound,
                ignoreResponseIdCompare
              })
            );

            // format data
            const formattedResponseData = responseFormatter.getFormattedResponse();

            // check if needs to retry request     
            const needsToRetry = checkToDoRetry({
              formattedResponseData,
              retry,
              retryCounter,
              extraVerifyRetry,
              notRetryWhenOffline
            });

            if(needsToRetry && typeof retryCounter !== 'undefined'){
              await sleep(sleepTime);

              return getRequest(retryCounter + 1)
            }

            // remove the abort listener
            this.removeAbortListenerFromRequest();
            
            const proxyBaseParams = {
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
            }

            this.traceBaseRequest({
              ...proxyBaseParams,
              traceRequestCallback,
              tracingDisabled,
            })

            const responseFromMiddlewares = await this.getMiddlewareCombinedResponse({
              response: formattedResponseData,
              endpoint,
              method,
              middlewaresAreDisabled,
              retryRequest: (additionalParams:Partial<IRequestParams>) => this.makeFetch({...mainParams,...additionalParams}),
              pureRequestParams:proxyBaseParams
            });

            this.setResponseToCache({
              endpoint,
              method,
              requestBody:fetchParams.body,
              requestHeaders:fetchParams.headers,
              requestCookies:this.cookie,
              cacheIsDisabled,
              cacheNoStore,
              requestCache,
              response: responseFromMiddlewares,
              fullEndpoint:formattedEndpoint
            }) 

            // return response data
            return responseFromMiddlewares;
          }

          this.validationError = true;
        }

        // if a status is above 500 or response not valid or response.statusText is empty 
        // throw an error with default error message
        const validationErrorMessage = this.getFilteredDefaultErrorMessage({response, isErrorTextStraightToOutput});

        throw new Error(validationErrorMessage);
      })
      .catch(async(error: Error) => {
        const userAbortedRequest = getIsAbortRequestError(error.message);
        const errorRequestMessage = isErrorTextStraightToOutput || userAbortedRequest 
          ? error.message 
          : NETWORK_ERROR_KEY;

        // check if there was no connection
        const isOnlineRequest = getIsRequestOnline();

        // todo refactor
        // check if needs to retry request   
        if (typeof retry !== 'undefined' && 
            typeof retryCounter !== 'undefined' && 
            retryCounter < retry &&
            // retry if online or if not notRetryWhenOffline
            (isOnlineRequest || !notRetryWhenOffline)
        ) {
          await sleep(sleepTime);
          
          return getRequest(retryCounter + 1)
        }

        // remove the abort listener
        this.removeAbortListenerFromRequest();

        // make error logs
        makeErrorRequestLogs({
          endpoint,
          errorRequestMessage,
          fetchBody,
          userAbortedRequest
        });


        const errorCode = isOnlineRequest ? REQUEST_ERROR_STATUS_CODE : OFFLINE_STATUS_CODE;
        
        const formattedResponseError = new ErrorResponseFormatter().getFormattedErrorResponse({
          errorDictionaryParams: {
            translateFunction,
            errorTextKey: errorRequestMessage,
            isErrorTextStraightToOutput,
            statusCode: errorCode,
            userAbortedRequest
          },
          statusCode: errorCode,
          responseHeaders: this.responseHeaders,
        });
        
        const proxyBaseParams = {
          validationError: this.validationError,
          response: this.response,
          requestCookies:this.cookie,
          requestBody:fetchParams.body,
          requestHeaders:fetchParams.headers,
          responseBody: this.parsedResponseData,
          formattedResponse: formattedResponseError,
          endpoint,
          method,
          code: this.statusCode,
        }

        this.traceBaseRequest({
          ...proxyBaseParams,
          traceRequestCallback,
          requestError: true,
          tracingDisabled,
        });

        const responseFromMiddlewares = await this.getMiddlewareCombinedResponse({
          response: formattedResponseError,
          endpoint,
          method,
          middlewaresAreDisabled,
          retryRequest: (additionalParams:Partial<IRequestParams>) => this.makeFetch({...mainParams,...additionalParams}),
          pureRequestParams:proxyBaseParams
        });

        // return error response data
        return responseFromMiddlewares;
      })
    };

    return this.requestRacer({
      request: getRequest(1),
      fetchController,
      translateFunction,
      isErrorTextStraightToOutput,
      customTimeout
    });
  };

  getTimeoutException = ({
    translateFunction,
    isErrorTextStraightToOutput,
    fetchController,
    customTimeout,
  }: GetTimeoutExceptionParamsType): Promise<IResponse> => {
    const isNode = getIsNode();

    return new Promise((resolve) => {
      return setTimeout(() => {
        const requestTimeoutError: IResponse = new ErrorResponseFormatter().getFormattedErrorResponse(
          {
            errorDictionaryParams: {
              translateFunction,
              errorTextKey: TIMEOUT_ERROR_KEY,
              isErrorTextStraightToOutput,
              statusCode: REQUEST_ERROR_STATUS_CODE
            },
            statusCode: REQUEST_ERROR_STATUS_CODE,
            responseHeaders: this.responseHeaders
          }
        );

        // if the window fetch
        if (!isNode) {
          fetchController.abort();
        }

        resolve(requestTimeoutError);
      }, customTimeout || TIMEOUT_VALUE)
    });
  }

  requestRacer = ({
    request,
    fetchController,
    translateFunction,
    isErrorTextStraightToOutput,
    customTimeout
  }: RequestRacerParams): Promise<IResponse> => {
    const timeoutException = this.getTimeoutException({
      fetchController,
      translateFunction,
      isErrorTextStraightToOutput,
      customTimeout
    });

    return Promise.race([request, timeoutException]);
  };
}
