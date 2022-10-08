import {
  IRESTPureResponse,
  GetIsSchemaResponseValidParams,
  GetCompareIdsParams,
  GetFormatValidateMethodParams,
  IJSONRPCPureResponse,
  IDType,
  FormatValidateParams,
  FormatValidateParamsMethod,
} from '@/types';
import { requestProtocolsMap } from '@/constants';

interface IResponseFormatValidator {
  getIsRestFormatResponseValid: (response: IRESTPureResponse) => boolean;

  getIsJSONRPCFormatResponseValid: (params: IJSONRPCPureResponse) => boolean;

  getIsSchemaResponseValid: (params: GetIsSchemaResponseValidParams) => {
    error: boolean;
    errorText: string;
  };

  getCompareIds: ({ requestId, responceId }: GetCompareIdsParams) => boolean;

  getRestFormatIsValid: (response: any) => boolean;

  getJSONRPCFormatIsValid: (response: any) => boolean;

  getFormatValidateMethod: (params: GetFormatValidateMethodParams) => any; // todo fix any type in next release
}

export class FormatDataTypeValidator implements IResponseFormatValidator {
  public getIsRestFormatResponseValid = (
    response: IRESTPureResponse,
  ): boolean => {
    const baseChecksValid =
      'error' in response &&
      'errorText' in response &&
      'additionalErrors' in response &&
      'data' in response;

    if (!baseChecksValid) {
      return false;
    }

    const additionalChecks =
      typeof response.error === 'boolean' &&
      typeof response.errorText === 'string';

    return additionalChecks;
  };

  public getIsJSONRPCFormatResponseValid = (
    response: IJSONRPCPureResponse,
  ): boolean =>
    Boolean(
      ('result' in response ||
        (response.error &&
          'code' in response.error &&
          'data' in response.error &&
          'trKey' in response.error.data &&
          'message' in response.error)) &&
        'jsonrpc' in response &&
        'id' in response,
    );

  public getIsSchemaResponseValid = ({
    data,
    error,
    schema,
  }: GetIsSchemaResponseValidParams): { error: boolean; errorText: string } => {
    // if the error flag is true
    // then not validate
    if (error || !schema) {
      return { error: false, errorText: '' };
    }

    const validationResult = schema.validate(data, {
      allowUnknown: true,
      abortEarly: false,
    });

    return {
      error: Boolean(validationResult.error),
      errorText: validationResult.error,
    };
  };

  public getCompareIds = ({
    requestId,
    responceId,
  }: GetCompareIdsParams): boolean => requestId === responceId;

  // todo fix any type
  public getRestFormatIsValid = ({
    response,
    schema,
    isPureFileRequest,
  }: any): boolean => {
    if (!Boolean(response)) {
      console.error('(fetch-api): response is empty');
      return false;
    }

    if (isPureFileRequest) {
      return true;
    }

    const isFormatValid = this.getIsRestFormatResponseValid(response);

    // if the base format is not valid
    if (!isFormatValid) {
      console.error('(fetch-api): response base format is not valid');
      console.error('(fetch-api): full response: ', response);
      return false;
    }

    const { error: isSchemaError, errorText: schemaErrorValue } =
      this.getIsSchemaResponseValid({
        data: response.data,
        error: response.error,
        schema,
      });

    // if the schema format is not valid
    if (isSchemaError) {
      console.error('(fetch-api): response schema format is not valid');
      console.error('(fetch-api): error in schema', schemaErrorValue);
      return false;
    }

    return true;
  };

  checkIdsEquality = ({
    prev,
    curr,
    ignoreResponseIdCompare,
  }: {
    prev: IDType;
    curr: IDType;
    ignoreResponseIdCompare?: boolean;
  }): boolean => {
    if (ignoreResponseIdCompare) {
      return true;
    }

    return prev === curr;
  };

  // todo fix any type
  public getJSONRPCFormatIsValid = ({
    response,
    schema,
    prevId,
    isBatchRequest,
    ignoreResponseIdCompare,
    requestBody,
  }: any): boolean => {
    // return true because all validation will be prepared in Formatter
    if (isBatchRequest) {
      if (requestBody.length !== response.length) {
        console.error('(fetch-api): request-response lengths are not equal');
        return false;
      }

      return true;
    }

    if (!Boolean(response)) {
      console.error('(fetch-api): response is empty');
      console.error('(fetch-api): full response: ', response);
      return false;
    }

    const idsAreEqual = this.checkIdsEquality({
      prev: prevId,
      curr: response.id,
      ignoreResponseIdCompare,
    });

    // if ids are not equal
    if (!idsAreEqual) {
      console.error('(fetch-api): request-response ids are not equal');
      console.error('(fetch-api): full response: ', response);
      return false;
    }

    const isFormatValid = this.getIsJSONRPCFormatResponseValid(response);

    // if the base format is not valid
    if (!isFormatValid) {
      console.error('(fetch-api): response base format is not valid');
      console.error('(fetch-api): full response: ', response);
      return false;
    }

    const { error: isSchemaError, errorText: schemaErrorValue } =
      this.getIsSchemaResponseValid({
        data: response.result,
        error: Boolean(response.error),
        schema,
      });

    // if the schema format is not valid
    if (isSchemaError) {
      console.error('(fetch-api): response schema format is not valid');
      console.error('(fetch-api): error in schema', schemaErrorValue);
      return false;
    }

    return true;
  };

  public getPureRestFormatIsValid = ({
    response,
    schema,
    isResponseStatusSuccess,
    isStatusEmpty,
    isPureFileRequest,
  }: FormatValidateParams): boolean => {
    if (isStatusEmpty) {
      return true;
    }

    if (isPureFileRequest) {
      return true;
    }

    if (!Boolean(response)) {
      console.error('(fetch-api): response is empty');
      console.error('(fetch-api): full response: ', response);
      return false;
    }

    const { error: isSchemaError, errorText: schemaErrorValue } =
      this.getIsSchemaResponseValid({
        data: response,
        error: !isResponseStatusSuccess,
        schema,
      });

    // if the schema format is not valid
    if (isSchemaError) {
      console.error('(fetch-api): response schema format is not valid');
      console.error('(fetch-api): error in schema', schemaErrorValue);
      return false;
    }

    return true;
  };

  private truthyValidator = (): boolean => true;

  public getFormatValidateMethod = ({
    protocol,
    extraValidationCallback,
    responseSchema,
  }: GetFormatValidateMethodParams): FormatValidateParamsMethod => {
    // if there is an extra callback for validations
    if (extraValidationCallback) {
      return extraValidationCallback;
    }

    if (!Boolean(responseSchema)) {
      return this.truthyValidator;
    }

    switch (protocol) {
      case requestProtocolsMap.rest:
        return this.getRestFormatIsValid;

      case requestProtocolsMap.jsonRpc:
        return this.getJSONRPCFormatIsValid;

      case requestProtocolsMap.pureRest:
        return this.getPureRestFormatIsValid;

      default:
        return this.getRestFormatIsValid;
    }
  };
}
