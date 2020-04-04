import { IResponse, IJSONRPCPureResponse } from '@/types/types';

export const formatResponseJSONRPCData = (
  data: IJSONRPCPureResponse,
): IResponse => ({
  errorText: data.error ? data.error.message : '',
  additionalErrors: data.error ? data.error.additionalErrors : null,
  error: Boolean(data.error),
  data: Boolean(data.result) ? data.result : {},
});
