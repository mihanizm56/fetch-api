import { Schema, ValidationResult } from "joi"; // eslint-disable-line
import { IBaseResponse } from '@/types/types';

interface IResponseFormatValidator {
  response: IBaseResponse;

  schema: Schema;

  getIsBaseFormatRequestValid: () => boolean;

  getResponseFormatIsValid: () => boolean;

  getIsSchemaRequestValid: () => boolean;
}

export class FormatDataTypeValidator implements IResponseFormatValidator {
  response: IBaseResponse;

  schema: Schema;

  constructor({ respondedData, responseSchema }: any) {
    this.response = respondedData;
    this.schema = responseSchema;
  }

  public getIsBaseFormatRequestValid = () =>
    'error' in this.response &&
    'errorText' in this.response &&
    'additionalErrors' in this.response &&
    'data' in this.response;

  public getIsSchemaRequestValid = () => {
    const validationResult = this.schema.validate(this.response.data);

    console.error('this.schema', this.schema);
    console.error('this.response', this.response);
    console.error('validationResult', validationResult);
    console.error(
      '!Boolean(validationResult.error)',
      !Boolean(validationResult.error),
    );

    return !Boolean(validationResult.error);
  };

  public getResponseFormatIsValid = () => {
    if (!Boolean(this.response)) {
      console.error('response is empty');
      return false;
    }

    const isBaseFormatRequestValid = this.getIsBaseFormatRequestValid();

    // if the base format is not valid
    if (!isBaseFormatRequestValid) {
      console.error('response format is not valid');
      return false;
    }

    const isSchemaRequestValid = this.getIsSchemaRequestValid();

    // if the schema format is not valid
    if (!isSchemaRequestValid) {
      console.error('response schema is not valid');
      return false;
    }

    return true;
  };
}
