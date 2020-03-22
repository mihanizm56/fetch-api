import { IBaseResponse } from '@/types/types';

interface IResponseFormatValidator {
  response: IBaseResponse;

  getResponseFormatIsValid: () => boolean;
}

export class FormatDataTypeValidator implements IResponseFormatValidator {
  response: IBaseResponse;

  constructor(response: IBaseResponse) {
    this.response = response;
  }

  public getIsBaseFormatRequestValid = () =>
    'error' in this.response &&
    'errorText' in this.response &&
    'additionalErrors' in this.response &&
    'data' in this.response;

  public getResponseFormatIsValid = () => {
    const isBaseFormatRequestValid = this.getIsBaseFormatRequestValid();

    // todo make joi validations

    return isBaseFormatRequestValid;
  };
}
