import {
  ResponseFormatter,
  IResponse,
  FormatResponseRESTDataOptionsType,
  FormattedLanguageDictionary,
} from '@/types/types';
import { getFormattedResponseErrorText } from '@/errors/get-formatted-response-error';

export class RestResponseFormatter extends ResponseFormatter {
  data?: any;

  error: boolean;

  langDict: FormattedLanguageDictionary;

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
      ? getFormattedResponseErrorText({
          errorTextKey: this.errorText,
          languageDictionary: this.langDict,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
        })
      : '',
    additionalErrors: this.additionalErrors,
  });
}
