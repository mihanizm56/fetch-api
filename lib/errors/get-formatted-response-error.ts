import { ErrorRestConstructorParams } from "@/types/types";
import { DEFAULT_ERROR_MESSAGE } from "./constants";

export const getFormattedResponseErrorText = ({
  errorTextKey,
  errorsMap
}: ErrorRestConstructorParams) => {
  const formattedError = errorsMap[errorTextKey];

  return formattedError || DEFAULT_ERROR_MESSAGE;
};
