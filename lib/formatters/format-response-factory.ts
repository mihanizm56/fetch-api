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
    langDict,
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
          langDict,
          isErrorTextStraightToOutput,
        })
      : new JSONRPCResponseFormatter({
          jsonrpc,
          id,
          error,
          result,
          langDict,
          isErrorTextStraightToOutput,
        });
  };
}
