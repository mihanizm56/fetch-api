import {
  ResponseFormatter,
  TranslateFunction,
  IJSONRPCPureResponse,
  IResponse,
  IJSONPRCRequestFormattedBodyParams,
} from '@/types';
import { ErrorResponseFormatter } from '@/errors-formatter/error-response-formatter';
import { FormatDataTypeValidator } from '@/validators/response-type-validator';
import { NETWORK_ERROR_KEY } from '@/constants/shared';
import { JSONRPCResponseFormatter } from './jsonrpc-response-formatter';

type ParamsType = {
  data: Array<IJSONRPCPureResponse>;
  isErrorTextStraightToOutput?: boolean;
  statusCode: number;
  translateFunction?: TranslateFunction;
  responseSchema?: Array<any>;
  body?: Array<IJSONPRCRequestFormattedBodyParams>;
};

export class JSONRPCBatchResponseFormatter extends ResponseFormatter {
  data: Array<IJSONRPCPureResponse>;

  isErrorTextStraightToOutput?: boolean;

  statusCode: number;

  responseSchema?: Array<any>;

  translateFunction?: TranslateFunction;

  body?: Array<IJSONPRCRequestFormattedBodyParams>;

  constructor({
    data,
    isErrorTextStraightToOutput,
    statusCode,
    translateFunction,
    responseSchema,
    body,
  }: ParamsType) {
    super();
    this.data = data;
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
    this.statusCode = statusCode;
    this.translateFunction = translateFunction;
    this.responseSchema = responseSchema;
    this.body = body;
  }

  getFormattedData = () =>
    this.data.map((responseItemData, index) => {
      const validator = new FormatDataTypeValidator();
      const prevId = this.body ? this.body[index].id : null;
      const schema = this.responseSchema ? this.responseSchema[index] : null;
      const dataItemCode = responseItemData.error ? 500 : 200;

      const isFormatValid = validator.getJSONRPCFormatIsValid({
        response: responseItemData,
        schema,
        prevId,
      });

      if (isFormatValid) {
        return new JSONRPCResponseFormatter({
          ...responseItemData,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
          statusCode: dataItemCode,
          translateFunction: this.translateFunction,
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
      });
    });

  getFormattedResponse = (): IResponse => {
    const formattedData = this.getFormattedData();

    return {
      errorText: '',
      error: false,
      data: formattedData,
      additionalErrors: null,
      code: this.statusCode,
    };
  };
}
