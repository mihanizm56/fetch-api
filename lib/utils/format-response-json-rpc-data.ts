import { IResponse, IJSONRPCPureResponse } from '@/types/types';

export const formatResponseJSONRPCData = (
  data: IJSONRPCPureResponse,
): IResponse => ({
  error: Boolean(data.error),
  errorText: data.error ? data.error.message : '',
  data: data.result,
  additionalErrors: data.error ? data.error.additionalErrors : null,
});
