import { IJSONRPCPureResponse, ExtendedIResponse } from '@/types/types';

export const formatResponseJSONRPCData = (
  data: IJSONRPCPureResponse,
): ExtendedIResponse => {
  const responseRestFormat: ExtendedIResponse = {
    errorText: data.error ? data.error.message : '',
    error: Boolean(data.error),
    data: Boolean(data.result) ? data.result : {},
  };

  // insert field additionalErrors manually
  if (data.error) {
    responseRestFormat.additionalErrors = data.error.additionalErrors;
  } else {
    responseRestFormat.additionalErrors = null;
  }

  return responseRestFormat;
};
