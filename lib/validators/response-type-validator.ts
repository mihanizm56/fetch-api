import { Schema } from "joi"; // eslint-disable-line
import { IRESTResponse, IJSONRPCResponse } from '@/types/types';
import { requestProtocolsMap } from '@/constants/shared';
import { getProtocolTypeIsRest } from '@/utils/get-protocol-type-is-rest';

interface IResponseFormatValidator {
  response: IRESTResponse & IJSONRPCResponse;

  schema: Schema;

  requestProtocol: keyof typeof requestProtocolsMap;

  getIsBaseFormatRequestValid: () => boolean;

  getResponseFormatIsValid: () => boolean;

  getIsSchemaRequestValid: () => boolean;
}

export class FormatDataTypeValidator implements IResponseFormatValidator {
  response: IRESTResponse & IJSONRPCResponse;

  schema: Schema;

  requestProtocol: keyof typeof requestProtocolsMap;

  constructor({ respondedData, responseSchema, requestProtocol }: any) {
    this.response = respondedData;
    this.schema = responseSchema;
    this.requestProtocol = requestProtocol;
  }

  public getIsBaseFormatRequestValid = () =>
    'error' in this.response &&
    'errorText' in this.response &&
    'additionalErrors' in this.response &&
    'data' in this.response;

  public getIsJSONRPCFormatRequestValid = () =>
    'jsonrpc' in this.response &&
    ('result' in this.response || 'error' in this.response) &&
    'id' in this.response;

  public getIsSchemaRequestValid = () => {
    const { error, data, result } = this.response;

    // if the error flag is true
    if (Boolean(error)) {
      return true;
    }

    const responsePartToValidate = getProtocolTypeIsRest(this.requestProtocol)
      ? data
      : result;

    const validationResult = this.schema.validate(responsePartToValidate);

    return !Boolean(validationResult.error);
  };

  public getResponseFormatIsValid = () => {
    if (!Boolean(this.response)) {
      console.error('response is empty');
      return false;
    }

    const isFormatValid = getProtocolTypeIsRest(this.requestProtocol)
      ? this.getIsBaseFormatRequestValid()
      : this.getIsJSONRPCFormatRequestValid();

    // if the base format is not valid
    if (!isFormatValid) {
      console.error('response base format is not valid');
      return false;
    }

    const isSchemaRequestValid = this.getIsSchemaRequestValid();

    // if the schema format is not valid
    if (!isSchemaRequestValid) {
      console.error('response schema format is not valid');
      return false;
    }

    return true;
  };
}
