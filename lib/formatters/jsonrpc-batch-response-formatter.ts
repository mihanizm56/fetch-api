import {
  ResponseFormatter,
  TranslateFunctionType,
  IJSONRPCPureResponse,
  IResponse,
  IJSONPRCRequestFormattedBodyParams,
} from '@/types';
import { ErrorResponseFormatter } from '@/errors-formatter/error-response-formatter';
import { FormatDataTypeValidator } from '@/validators/response-type-validator';
import { ID_REGEX, NETWORK_ERROR_KEY } from '@/constants';
import { JSONRPCResponseFormatter } from './jsonrpc-response-formatter';

type ParamsType = {
  data: Array<IJSONRPCPureResponse>;
  isErrorTextStraightToOutput?: boolean;
  statusCode: number;
  translateFunction?: TranslateFunctionType;
  responseSchema?: Array<any>;
  body?: Array<IJSONPRCRequestFormattedBodyParams>;
  responseHeaders: Record<string, string>;
  ignoreResponseIdCompare?: boolean;
};

export class JSONRPCBatchResponseFormatter extends ResponseFormatter {
  data: Array<IJSONRPCPureResponse>;

  isErrorTextStraightToOutput?: boolean;

  statusCode: number;

  responseSchema?: Array<any>;

  translateFunction?: TranslateFunctionType;

  body?: Array<IJSONPRCRequestFormattedBodyParams>;

  responseHeaders: Record<string, string>;

  ignoreResponseIdCompare?: boolean;

  constructor({
    data,
    isErrorTextStraightToOutput,
    statusCode,
    translateFunction,
    responseSchema,
    body,
    responseHeaders,
    ignoreResponseIdCompare,
  }: ParamsType) {
    super();
    this.data = data;
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
    this.ignoreResponseIdCompare = ignoreResponseIdCompare;
    this.statusCode = statusCode;
    this.translateFunction = translateFunction;
    this.responseSchema = responseSchema;
    this.body = body;
    this.responseHeaders = responseHeaders;
  }

  getNumberId = (id: number | string): number => {
    try {
      if (typeof id === 'number') {
        return id;
      }

      if (ID_REGEX.test(id)) {
        return Number(id.replace(ID_REGEX, ''));
      }

      return 0;
    } catch (error) {
      console.error('error in getNumberId', error);
      return 0;
    }
  };

  getSortedByIDsBatchResponse = (): Array<IJSONRPCPureResponse> => {
    return this.data.sort((next, prev) => {
      const prevNumber = this.getNumberId(prev.id);
      const nextNumber = this.getNumberId(next.id);

      return nextNumber - prevNumber;
    });
  };

  getFormattedData = () => {
    const sortedData = this.getSortedByIDsBatchResponse();

    return sortedData.map((responseItemData, index) => {
      const validator = new FormatDataTypeValidator();
      const prevId = this.body ? this.body[index].id : null;
      const schema = this.responseSchema ? this.responseSchema[index] : null;
      const dataItemCode = responseItemData.error ? 500 : 200;

      const isFormatValid = validator.getJSONRPCFormatIsValid({
        response: responseItemData,
        schema,
        prevId,
        ignoreResponseIdCompare: this.ignoreResponseIdCompare,
      });

      if (isFormatValid) {
        return new JSONRPCResponseFormatter({
          ...responseItemData,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
          statusCode: dataItemCode,
          translateFunction: this.translateFunction,
          responseHeaders: this.responseHeaders,
        }).getFormattedResponse();
      }

      return new ErrorResponseFormatter().getFormattedErrorResponse({
        errorDictionaryParams: {
          errorTextKey: NETWORK_ERROR_KEY,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
          translateFunction: this.translateFunction,
          statusCode: 500,
        },
        statusCode: 500,
        responseHeaders: this.responseHeaders,
      });
    });
  };

  getFormattedResponse = (): IResponse => {
    const formattedData = this.getFormattedData();

    return {
      errorText: '',
      error: false,
      data: formattedData,
      additionalErrors: null,
      code: this.statusCode,
      headers: this.responseHeaders,
    };
  };
}
