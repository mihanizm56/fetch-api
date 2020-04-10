module.exports.errorsMap = {
  TIMEOUT_ERROR: {
    ru: 'Превышено ожидание запроса',
  },
  REQUEST_DEFAULT_ERROR: {
    ru: 'Системная ошибка',
  },
  test: {
    ru: 'Тестовая ошибка',
    en: 'Test error',
  },
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
  errorText: 'Test error',
};
