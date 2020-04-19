const {
  getRestSchema,
  postRestSchema,
  putRestSchema,
  patchRestSchema,
  deleteRestSchema,
} = require('./schemas/rest');
const {
  getRestRequest,
  postRestRequest,
  putRestRequest,
  patchRestRequest,
  deleteRestRequest,
  getNegativeRestRequest,
  getNegativeRestRequestEn,
  postNegativeRestRequest,
  putNegativeRestRequest,
  patchNegativeRestRequest,
  deleteNegativeRestRequest,
  getNegativeRestRequestStraightError,
  getRestRequestWithCustomResponseValidation,
} = require('./requests/rest');
const {
  SYSTEM_ERROR,
  translatedErrorRu,
  translatedErrorEn,
} = require('./constants');

describe('tests rest request protocol', () => {
  beforeEach(() => {
    delete global.window;
  });
  describe('positive response', () => {
    test('get request', async () => {
      const data = await getRestRequest(getRestSchema);

      expect(data).toEqual({
        additionalErrors: null,
        data: { foo: 'bar' },
        error: false,
        errorText: '',
      });
    });
    test('post request', async () => {
      const data = await postRestRequest(postRestSchema);

      expect(data).toEqual({
        additionalErrors: null,
        data: { foo: 'bar', index: 1 },
        error: false,
        errorText: '',
      });
    });
    test('put request', async () => {
      const data = await putRestRequest(putRestSchema);

      expect(data).toEqual({
        additionalErrors: null,
        data: { putField: 123 },
        error: false,
        errorText: '',
      });
    });
    test('patch request', async () => {
      const data = await patchRestRequest(patchRestSchema);

      expect(data).toEqual({
        additionalErrors: null,
        data: { test: 'test' },
        error: false,
        errorText: '',
      });
    });
    test('delete request', async () => {
      const data = await deleteRestRequest(deleteRestSchema);

      expect(data).toEqual({
        additionalErrors: null,
        data: { test: null },
        error: false,
        errorText: '',
      });
    });
    test('get request with extra handler validation callback, callback returns true', async () => {
      const extraValidationCallback = () => true;

      const data = await getRestRequestWithCustomResponseValidation({
        responseSchema: getRestSchema,
        extraValidationCallback,
      });

      expect(data).toEqual({
        additionalErrors: null,
        data: { foo: 'bar' },
        error: false,
        errorText: '',
      });
    });
    test('get request with extra handler validation callback, callback returns false', async () => {
      const extraValidationCallback = () => false;

      const data = await getRestRequestWithCustomResponseValidation({
        responseSchema: getRestSchema,
        extraValidationCallback,
      });

      expect(data).toEqual(SYSTEM_ERROR);
    });
  });
  describe('negative response', () => {
    test('get request', async () => {
      const data = await getNegativeRestRequest(getRestSchema);

      expect(data).toEqual(translatedErrorRu);
    });
    test('get request and get error in en', async () => {
      const data = await getNegativeRestRequestEn(getRestSchema);

      expect(data).toEqual(translatedErrorEn);
    });
    test('get straight error text from server', async () => {
      const data = await getNegativeRestRequestStraightError(getRestSchema);

      expect(data).toEqual({
        additionalErrors: { username: 'not valid data' },
        data: {},
        error: true,
        errorText: 'test',
      });
    });
    test('post request', async () => {
      const data = await postNegativeRestRequest(postRestSchema);

      expect(data).toEqual(translatedErrorRu);
    });
    test('put request', async () => {
      const data = await putNegativeRestRequest(putRestSchema);

      expect(data).toEqual(translatedErrorRu);
    });
    test('patch request', async () => {
      const data = await patchNegativeRestRequest(patchRestSchema);

      expect(data).toEqual(translatedErrorRu);
    });
    test('delete request', async () => {
      const data = await deleteNegativeRestRequest(deleteRestSchema);

      expect(data).toEqual(translatedErrorRu);
    });
  });
  describe('not valid response', () => {
    test('get request', async () => {
      const data = await getRestRequest(postRestSchema);

      expect(data).toEqual(SYSTEM_ERROR);
    });
    test('post request', async () => {
      const data = await postRestRequest(getRestSchema);

      expect(data).toEqual(SYSTEM_ERROR);
    });
    test('put request', async () => {
      const data = await putRestRequest(patchRestSchema);

      expect(data).toEqual(SYSTEM_ERROR);
    });
    test('patch request', async () => {
      const data = await patchRestRequest(putRestSchema);

      expect(data).toEqual(SYSTEM_ERROR);
    });
    test('delete request', async () => {
      const data = await deleteRestRequest(putRestSchema);

      expect(data).toEqual(SYSTEM_ERROR);
    });
  });
});
