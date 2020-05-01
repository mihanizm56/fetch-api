module.exports.SYSTEM_ERROR = {
  additionalErrors: null,
  data: {},
  error: true,
  errorText: 'trans func returns translation with key network-error undefined',
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

module.exports.translateFunction = (key, options) =>
  `trans func returns translation with key ${key} ${JSON.stringify(options)}`;
