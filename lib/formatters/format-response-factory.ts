import {
  IFormatResponseFactory,
  ResponseFormatter,
  FormatResponseParamsType,
} from '@/types/types';
import { isRestRequest } from '../utils/is-rest-request';
import { JSONRPCResponseFormatter } from './jsonrpc-response-formatter';
import { RestResponseFormatter } from './rest-response-formatter';

export class FormatResponseFactory implements IFormatResponseFactory {
  createFormatter = ({
    errorsMap,
    protocol,
    data,
    error,
    errorText,
    additionalErrors,
    result,
    jsonrpc,
    id,
    isErrorTextStraightToOutput,
  }: FormatResponseParamsType): ResponseFormatter => {
    return isRestRequest(protocol)
      ? new RestResponseFormatter({
          data,
          error,
          errorText,
          additionalErrors,
          errorsMap,
          isErrorTextStraightToOutput,
        })
      : new JSONRPCResponseFormatter({
          jsonrpc,
          id,
          error,
          result,
          errorsMap,
          isErrorTextStraightToOutput,
        });
  };
}
