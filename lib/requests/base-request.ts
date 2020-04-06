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
} from "@/types/types";
import { parseTypesMap, requestProtocolsMap } from "@/constants/shared";
import { formatResponseJSONRPCData } from "@/utils/format-response-json-rpc-data";
import { DEFAULT_ERROR_MESSAGE } from "../errors/constants";
import { StatusValidator } from "../validators/response-status-validator";
import { FormatDataTypeValidator } from "../validators/response-type-validator";
import { errorResponseConstructor } from "../errors/error-constructor";
import { TIMEOUT_VALUE } from "../constants/timeout";
import { jsonParser } from "../utils/parsers/json-parser";
import { blobParser } from "../utils/parsers/blob-parser";
import { objectToQueryString } from "../utils/object-to-query-string";
import { isRestRequest } from "@/utils/is-rest-request";

interface IBaseRequests {
  makeFetch: (
    values: IRequestParams &
      IJSONPRCRequestParams & {
        requestProtocol: keyof typeof requestProtocolsMap;
      } & {method:string}
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
    fetchParams,
  }: GetIsomorphicFetchParamsType): GetIsomorphicFetchReturnsType => {
    if (typeof window === "undefined") {
      const requestFetch = (nodeFetch.bind(
        // eslint-disable-line
        null,
        endpoint,
        fetchParams
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

  makeFetch = <
    MakeFetchType extends IRequestParams &
      Partial<IJSONPRCRequestParams> & {
        requestProtocol: keyof typeof requestProtocolsMap;
      } & {method:string}
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
    errorsMap,
    responseSchema,
    requestProtocol,
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
        const isValidStatus = statusValidator.getStatusIsFromWhiteList(
          response.status
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
          const formatDataTypeValidator = new FormatDataTypeValidator().getFormatValidateMethod(
            requestProtocol
          );

          // get the full validation result
          const isFormatValid: boolean = formatDataTypeValidator({
            response: respondedData,
            schema: responseSchema,
            prevId: id,
          });

          if (isFormatValid) {
            const formattedResponseData: IResponse = isRestRequest(
              requestProtocol
            )
              ? respondedData
              : formatResponseJSONRPCData(respondedData);

            return formattedResponseData;
          }
        }

        // if not status from the whitelist - throw error with default error
        throw new Error(
          errorsMap.REQUEST_DEFAULT_ERROR || DEFAULT_ERROR_MESSAGE
        );
      })
      .catch((error) => {
        console.error("get error in fetch", error.message);

        return errorResponseConstructor({
          errorsMap,
          errorTextKey: errorsMap.REQUEST_DEFAULT_ERROR,
        });
      });

    return this.requestRacer({
      request,
      fetchController,
      errorsMap,
    });
  };

  requestRacer = ({
    request,
    fetchController,
    errorsMap,
  }: RequestRacerParams): Promise<IResponse> => {
    const defaultError: IResponse = errorResponseConstructor({
      errorsMap,
      errorTextKey: errorsMap.REQUEST_DEFAULT_ERROR,
    });

    const timeoutException: Promise<IResponse> = new Promise((resolve) =>
      setTimeout(() => {
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
