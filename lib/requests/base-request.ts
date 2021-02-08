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
  SetResponseTrackCallback,
  SetResponseParams,
  ExtendedResponse,
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
import { getIsStatusCodeSuccess } from "@/utils/get-is-status-code-success";



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

  getFormattedEndpoint:(params: FormattedEndpointParams) => string;

  getFetchBody: (params: GetFetchBodyParamsType) => any

  getFormattedHeaders:(options: GetFormattedHeadersParamsType) => Record<string,string> | undefined;
}

export class BaseRequest implements IBaseRequests {
  abortRequestListener: any = null; // TODO FIX ANY
  response: Response | null = null;
  pureResponseData: any = null;
  fetchParams?: RequestInit & Pick<IRequestParams, 'headers'> & {endpoint: string};

  static persistentOptions?: PersistentFetchParamsType;

  static responseTrackCallbacks: Array<SetResponseTrackCallback> = [];

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

  getFormattedHeaders = ({ body, headers = {}, isBlobOrTextRequest }: GetFormattedHeadersParamsType) => {
    if(isBlobOrTextRequest || isFormData(body)){
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
    isNotFound
  }: GetPreparedResponseDataParams): FormatResponseParamsType => {
    if ((parseType === 'blob' || parseType === 'text') && !isNotFound) {
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
    cache = cacheMap.default, // TODO проверить нужен ли дефолтный параметр,
    credentials,
    integrity,
    keepalive,
    redirect,
    referrer,
    referrerPolicy,
    retry
  }: MakeFetchType): Promise<IResponse> => {
    const isBlobOrTextRequest = parseType === parseTypesMap.blob || parseType === parseTypesMap.text;

    const formattedEndpoint = this.getFormattedEndpoint({
      endpoint,
      queryParams,
      arrayFormat
    });

    const formattedHeaders = this.getFormattedHeaders({
      body,
      headers,
      isBlobOrTextRequest
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
        const statusCode = response.status;
        const isStatusEmpty = statusCode === 204;
        const isNotFound = statusCode === 404;        
        
        // for text and blob response does not matter response to parse
        // but does matter what code we get from the backend
        // alse 404 is useful that can contain some data 
        // and we need to provide that code to the client
        const isValidStatus = isBlobOrTextRequest 
          ? statusCode === 200 || statusCode === 304 || statusCode === 404
          : statusCode <= 500;

        const isResponseStatusSuccess = getIsStatusCodeSuccess(statusCode);
        // disable all validations for "blob" and "text" requests
        // because they always parse the response in necessary format even if error

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

          this.pureResponseData = parsedResponseData;

          // validate the format of the request
          const formatDataTypeValidator = new FormatDataTypeValidator().getFormatValidateMethod(
            {
              protocol: requestProtocol,
              extraValidationCallback,
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
            isBlobOrTextRequest
          });          

          if (isFormatValid) {
            // get the formatter func
            const responseFormatter = new FormatResponseFactory().createFormatter(
              this.getPreparedResponseData({
                response: parsedResponseData,
                translateFunction,
                protocol: requestProtocol,
                isErrorTextStraightToOutput,
                parseType,
                statusCode,
                isBatchRequest,
                responseSchema,
                body,
                isNotFound
              })
            );

            // format data
            const formattedResponseData = responseFormatter.getFormattedResponse();

            // check if needs to retry request          
            if(formattedResponseData.error && typeof retry !== 'undefined' &&  typeof retryCounter !== 'undefined' &&  retryCounter < retry){
              return getRequest(retryCounter + 1)
            }

            // select the response data fields if all fields are not necessary
            // work only for json responses
            const selectedResponseData = (selectData || customSelectorData) && !isBlobOrTextRequest 
              ? getDataFromSelector({ selectData, responseData: formattedResponseData, customSelectorData }) 
              : formattedResponseData;

            // remove the abort listener
            this.removeAbortListenerFromRequest();

            // fire additional callbacks with response and request data
            BaseRequest.responseTrackCallbacks.forEach((callback)=>{
              callback({
                requestParams: fetchParams,
                response: this.response,
                pureResponseData: this.pureResponseData,
                formattedResponseData: formattedResponseData,
                requestError: false
              })
            });

            // return data
            return selectedResponseData;
          }
        }

        // if a status is above 500 or response not valid or response.statusText is empty 
        // throw an error with default error message
        const validationErrorMessage = this.getFilteredDefaultErrorMessage({response, isErrorTextStraightToOutput})

        throw new Error(validationErrorMessage);
      })
      .catch((error: Error) => {
        const errorRequestMessage = isErrorTextStraightToOutput ? error.message : NETWORK_ERROR_KEY
        
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

        // fire additional callbacks with response and request data
        BaseRequest.responseTrackCallbacks.forEach((callback)=>{
          callback({
            requestParams: fetchParams,
            response: this.response,
            pureResponseData: this.pureResponseData,
            formattedResponseData: formattedResponseError,
            requestError: false
          })
        });

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
