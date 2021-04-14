import { requestProtocolsMap } from '@/constants';
import {
  StatusValidatorMethodOutputType,
  StatusValidatorMethodParamsType,
  StatusValidatorParamsType,
} from '@/types';

interface IResponseStatusValidator {
  getPureRestStatusIsValid: (
    params: StatusValidatorMethodParamsType,
  ) => StatusValidatorMethodOutputType;

  getRestStatusIsValid: (
    params: StatusValidatorMethodParamsType,
  ) => StatusValidatorMethodOutputType;

  getJSONRPCStatusIsValid: (
    params: StatusValidatorMethodParamsType,
  ) => StatusValidatorMethodOutputType;

  getFormatValidateMethod: (params: StatusValidatorParamsType) => () => boolean;
}

export class ResponseStatusValidator implements IResponseStatusValidator {
  getPureRestStatusIsValid = ({
    isPureFileRequest,
    status,
  }: StatusValidatorMethodParamsType): StatusValidatorMethodOutputType => () => {
    // for text and blob response does not matter response to parse
    // but does matter what code we get from the backend
    // also 404 is useful that can contain some data
    // and we need to provide that code to the client

    return isPureFileRequest
      ? status === 200 || status === 304 || status === 404
      : status <= 500;
  };

  getRestStatusIsValid = ({
    status,
  }: StatusValidatorMethodParamsType): StatusValidatorMethodOutputType => () => {
    return status <= 500;
  };

  getJSONRPCStatusIsValid = ({
    isBatchRequest,
    status,
  }: StatusValidatorMethodParamsType): StatusValidatorMethodOutputType => () => {
    return isBatchRequest ? status < 400 : status <= 500;
  };

  getFormatValidateMethod = ({
    requestProtocol,
    isBatchRequest,
    isPureFileRequest,
    status,
  }: StatusValidatorParamsType): StatusValidatorMethodOutputType => {
    switch (requestProtocol) {
      case requestProtocolsMap.jsonRpc:
        return this.getJSONRPCStatusIsValid({
          isBatchRequest,
          isPureFileRequest,
          status,
        });

      case requestProtocolsMap.pureRest:
        return this.getPureRestStatusIsValid({
          isBatchRequest,
          isPureFileRequest,
          status,
        });

      default:
        return this.getRestStatusIsValid({
          isBatchRequest,
          isPureFileRequest,
          status,
        });
    }
  };
}
