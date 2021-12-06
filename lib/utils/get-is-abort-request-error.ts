import {
  ABORTED_ERROR_TEXT_CHROME,
  ABORTED_ERROR_TEXT_MOZILLA,
  ABORTED_ERROR_TEXT_SAFARI,
} from '@/constants';

export const getIsAbortRequestError = (message: string) => {
  return (
    message === ABORTED_ERROR_TEXT_CHROME ||
    message === ABORTED_ERROR_TEXT_MOZILLA ||
    message === ABORTED_ERROR_TEXT_SAFARI
  );
};
