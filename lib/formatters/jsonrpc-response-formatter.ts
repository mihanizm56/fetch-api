import {
  ResponseFormatter,
  IResponse,
  JSONRPCErrorType,
  FormatResponseJSONRPCDataOptionsType,
  LanguageDictionary,
} from '@/types/types';
import { ErrorResponseFormatter } from '@/errors-formatter/error-response-formatter';

export class JSONRPCResponseFormatter extends ResponseFormatter {
  result?: any;

  error?: JSONRPCErrorType;

  langDict: LanguageDictionary;

  isErrorTextStraightToOutput?: boolean;

  constructor({
    error,
    langDict,
    result,
    isErrorTextStraightToOutput,
  }: FormatResponseJSONRPCDataOptionsType) {
    super();

    this.result = result;
    this.error = error;
    this.langDict = langDict;
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
  }

  getFormattedResponse = (): IResponse => ({
    errorText: this.error
      ? new ErrorResponseFormatter().getFormattedErrorTextResponse({
          errorTextKey: this.isErrorTextStraightToOutput
            ? this.error.message
            : this.error.data.trKey,
          languageDictionary: this.langDict,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
        })
      : '',
    error: Boolean(this.error),
    data: this.result || null,
    additionalErrors: this.error ? this.error.data : null,
  });
}
