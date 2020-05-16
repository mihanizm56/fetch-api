import { ResponseFormatter, FormatResponseParamsType } from '@/types/types';
import { requestProtocolsMap } from '@/constants/shared';
import { JSONRPCResponseFormatter } from './jsonrpc-response-formatter';
import { RestResponseFormatter } from './rest-response-formatter';
import { BlobResponseFormatter } from './blob-response-formatter';

export interface IFormatResponseFactory {
  createFormatter: (params: FormatResponseParamsType) => ResponseFormatter;
}

export class FormatResponseFactory implements IFormatResponseFactory {
  createFormatter = ({
    translateFunction,
    protocol,
    data,
    error,
    errorText = '',
    additionalErrors = null,
    result,
    jsonrpc = '',
    id = '',
    isErrorTextStraightToOutput,
    isBlobGetRequest,
    statusCode,
  }: FormatResponseParamsType): ResponseFormatter => {
    if (isBlobGetRequest) {
      return new BlobResponseFormatter(data);
    }

    if (protocol === requestProtocolsMap.jsonRpc) {
      return new JSONRPCResponseFormatter({
        // eslint-disable-next-line
        // @ts-ignore
        error,
        jsonrpc,
        id,
        result,
        translateFunction,
        isErrorTextStraightToOutput,
        statusCode,
      });
    }

    return new RestResponseFormatter({
      data,
      error: Boolean(error), // because there may be no error (must be refactored)
      errorText,
      additionalErrors,
      translateFunction,
      isErrorTextStraightToOutput,
      statusCode,
    });
  };
}
