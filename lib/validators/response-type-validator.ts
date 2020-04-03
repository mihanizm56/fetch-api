import { Schema, boolean } from "joi"; // eslint-disable-line
import { FormatDataTypeValidatorParamsType, IResponse } from '@/types/types';

type GetCompareIdsParams = { requestId: string; responceId: string };

interface IResponseFormatValidator {
  response: IResponse;

  schema: Schema;

  getIsBaseFormatResponseValid: () => boolean;

  getIsSchemaResponseValid: () => boolean;

  getResponseFormatIsValid: () => boolean;

  getCompareIds: ({ requestId, responceId }: GetCompareIdsParams) => boolean;
}

export class FormatDataTypeValidator implements IResponseFormatValidator {
  response: IResponse;

  schema: Schema;

  constructor({
    responseData,
    responseSchema,
  }: FormatDataTypeValidatorParamsType) {
    this.response = responseData;
    this.schema = responseSchema;
  }

  public getIsBaseFormatResponseValid = () =>
    'error' in this.response &&
    'errorText' in this.response &&
    'additionalErrors' in this.response &&
    'data' in this.response;

  public getIsSchemaResponseValid = () => {
    const { error, data } = this.response;

    // if the error flag is true
    if (Boolean(error)) {
      return true;
    }

    const validationResult = this.schema.validate(data);

    return !Boolean(validationResult.error);
  };

  public getCompareIds = ({ requestId, responceId }: GetCompareIdsParams) =>
    requestId === responceId;

  public getResponseFormatIsValid = () => {
    if (!Boolean(this.response)) {
      console.error('response is empty');
      return false;
    }

    const isFormatValid = this.getIsBaseFormatResponseValid();

    // if the base format is not valid
    if (!isFormatValid) {
      console.error('response base format is not valid');
      return false;
    }

    const isSchemaRequestValid = this.getIsSchemaResponseValid();

    // if the schema format is not valid
    if (!isSchemaRequestValid) {
      console.error('response schema format is not valid');
      return false;
    }

    return true;
  };
}
