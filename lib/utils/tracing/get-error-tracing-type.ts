import { TRACING_ERRORS } from '@/constants';

type ParamsType = {
  requestError?: boolean;
  responseError?: boolean;
  validationError?: boolean;
};

export type ErrorTracingType =
  | null
  | typeof TRACING_ERRORS[keyof typeof TRACING_ERRORS];

export const getErrorTracingType = ({
  requestError,
  responseError,
  validationError,
}: ParamsType): ErrorTracingType => {
  if (validationError) {
    return TRACING_ERRORS.VALIDATION_ERROR;
  }

  if (responseError) {
    return TRACING_ERRORS.RESPONSE_ERROR;
  }

  if (requestError) {
    return TRACING_ERRORS.REQUEST_ERROR;
  }

  return null;
};
