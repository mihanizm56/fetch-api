import {
  ResponseFormatter,
  IResponse,
  FormatResponseRESTDataOptionsType,
  LanguageDictionary,
} from '@/types/types';
import { ErrorResponseFormatter } from '@/errors-formatter/error-response-formatter';

export class RestResponseFormatter extends ResponseFormatter {
  data?: any;

  error: boolean;

  langDict: LanguageDictionary;

  errorText: string;

  additionalErrors: Record<string, any> | Array<any> | null;

  isErrorTextStraightToOutput?: boolean;

  constructor({
    error,
    langDict,
    errorText,
    additionalErrors,
    data,
    isErrorTextStraightToOutput,
  }: FormatResponseRESTDataOptionsType) {
    super();

    this.error = error;
    this.langDict = langDict;
    this.errorText = errorText;
    this.additionalErrors = additionalErrors;
    this.data = data;
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
  }

  getFormattedResponse = (): IResponse => ({
    data: this.data || {},
    error: this.error,
    errorText: this.error
      ? new ErrorResponseFormatter().getFormattedErrorTextResponse({
          errorTextKey: this.errorText,
          languageDictionary: this.langDict,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
        })
      : '',
    additionalErrors: this.additionalErrors,
  });
}
