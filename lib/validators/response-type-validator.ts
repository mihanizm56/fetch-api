import { Schema } from "joi"; // eslint-disable-line
import { IRESTResponse, IJSONRPCResponse } from '@/types/types';
import { requestProtocolsMap } from '@/constants/shared';

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
    'result' in this.response &&
    'id' in this.response;

  public getIsSchemaRequestValid = () => {
    const responsePartToValidate =
      this.requestProtocol === requestProtocolsMap.rest
        ? this.response.data
        : this.response.result;

    const validationResult = this.schema.validate(responsePartToValidate);

    return !Boolean(validationResult.error);
  };

  public getResponseFormatIsValid = () => {
    if (!Boolean(this.response)) {
      console.error('response is empty');
      return false;
    }

    const isFormatValid =
      this.requestProtocol === requestProtocolsMap.rest
        ? this.getIsBaseFormatRequestValid()
        : this.getIsJSONRPCFormatRequestValid();

    // if the base format is not valid
    if (!isFormatValid) {
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
