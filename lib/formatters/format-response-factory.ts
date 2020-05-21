import { ResponseFormatter, FormatResponseParamsType } from '@/types/types';
import { requestProtocolsMap, parseTypesMap } from '@/constants/shared';
import { JSONRPCResponseFormatter } from './jsonrpc-response-formatter';
import { RestResponseFormatter } from './rest-response-formatter';
import { BlobResponseFormatter } from './blob-response-formatter';
import { TextResponseFormatter } from './text-response-formatter';

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
    parseType,
    statusCode,
  }: FormatResponseParamsType): ResponseFormatter => {
    if (parseType === parseTypesMap.blob) {
      return new BlobResponseFormatter(data);
    }

    if (parseType === parseTypesMap.text) {
      return new TextResponseFormatter(data);
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
