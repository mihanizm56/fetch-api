module.exports.errorsMap = {
  TIMEOUT_ERROR: 'Превышено ожидание запроса',
  REQUEST_DEFAULT_ERROR: 'Системная ошибка',
  test: 'Тестовая ошибка',
};

module.exports.SYSTEM_ERROR = {
  additionalErrors: null,
  data: {},
  error: true,
  errorText: 'Системная ошибка',
};

module.exports.translatedErrorRu = {
  additionalErrors: { username: 'not valid data' },
  data: {},
  error: true,
  errorText: 'Тестовая ошибка',
};

module.exports.translatedErrorEn = {
  additionalErrors: { username: 'not valid data' },
  data: {},
  error: true,
  errorText: 'Тестовая ошибка',
};
