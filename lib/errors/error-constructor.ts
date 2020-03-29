import { getFormattedResponseErrorText } from '@/errors/get-formatted-response-error';
import {
  IRESTResponse,
  IJSONRPCResponse,
  ErrorJSONRPCConstructorParams,
  ErrorRestConstructorParams,
} from '@/types/types';

export const errorRestConstructor = (
  errorOptions: ErrorRestConstructorParams,
): IRESTResponse => ({
  error: true,
  errorText: getFormattedResponseErrorText(errorOptions),
  data: {},
  additionalErrors: null,
});

export const errorJSONRPCConstructor = ({
  errorTextKey,
  errorsMap,
  id = '0',
}: ErrorJSONRPCConstructorParams): IJSONRPCResponse => ({
  jsonrpc: '2.0',
  error: {
    code: '500',
    message: getFormattedResponseErrorText({ errorTextKey, errorsMap }),
  },
  id,
});
