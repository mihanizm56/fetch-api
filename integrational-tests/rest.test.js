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
  postNegativeRestRequest,
  putNegativeRestRequest,
  patchNegativeRestRequest,
  deleteNegativeRestRequest,
} = require('./requests/rest');

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
  });
  describe('negative response', () => {
    test('get request', async () => {
      const data = await getNegativeRestRequest(getRestSchema);

      expect(data).toEqual({
        additionalErrors: {
          username: 'not valid data',
        },
        data: {},
        error: true,
        errorText: 'test error',
      });
    });
    test('post request', async () => {
      const data = await postNegativeRestRequest(postRestSchema);

      expect(data).toEqual({
        additionalErrors: {
          username: 'not valid data',
        },
        data: {},
        error: true,
        errorText: 'test error',
      });
    });
    test('put request', async () => {
      const data = await putNegativeRestRequest(putRestSchema);

      expect(data).toEqual({
        additionalErrors: {
          username: 'not valid data',
        },
        data: {},
        error: true,
        errorText: 'test error',
      });
    });
    test('patch request', async () => {
      const data = await patchNegativeRestRequest(patchRestSchema);

      expect(data).toEqual({
        additionalErrors: {
          username: 'not valid data',
        },
        data: {},
        error: true,
        errorText: 'test error',
      });
    });
    test('delete request', async () => {
      const data = await deleteNegativeRestRequest(deleteRestSchema);

      expect(data).toEqual({
        additionalErrors: {
          username: 'not valid data',
        },
        data: {},
        error: true,
        errorText: 'test error',
      });
    });
  });

  describe('not valid response', () => {
    test('get request', async () => {
      const data = await getRestRequest(postRestSchema);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText: 'Системная ошибка',
      });
    });
    test('post request', async () => {
      const data = await postRestRequest(getRestSchema);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText: 'Системная ошибка',
      });
    });
    test('put request', async () => {
      const data = await putRestRequest(patchRestSchema);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText: 'Системная ошибка',
      });
    });
    test('patch request', async () => {
      const data = await patchRestRequest(putRestSchema);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText: 'Системная ошибка',
      });
    });
    test('delete request', async () => {
      const data = await deleteRestRequest(putRestSchema);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText: 'Системная ошибка',
      });
    });
  });
});
