// backend-api
export const REQUEST_ERROR = 'request-error';
export const TIMEOUT_ERROR = 'timeout-error';
export const FORBIDDEN = 'forbidden';

// frontend-api
export const DEFAULT_ERROR_MESSAGE = 'Системная ошибка';
export const ERROR_SIZE_FILE_BIG = 'too big file size';
export const ERROR_TYPE_FILE = 'not valid file type';
export const ERROR_EMPTY_FILE = 'no file';

// errors map
export const errorsTranslationsMap = {
  [REQUEST_ERROR]: 'Системная ошибка',
  [FORBIDDEN]: 'Данное действие недоступно',
  [TIMEOUT_ERROR]: 'Превышено ожидание запроса',
};
