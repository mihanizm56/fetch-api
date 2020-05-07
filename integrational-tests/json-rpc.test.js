const { JSONRPCSchemaOne, JSONRPCSchemaTwo } = require('./schemas/json-rpc');
const {
  JSONRPCRequest,
  JSONRPCNegativeRequest,
  JSONRPCNegativeRequestEn,
  JSONRPCNegativeErrorsRequest,
  JSONRPCNegativeErrorsRequestStraightError,
  JSONRPCRequestWithCustomResponseValidation,
} = require('./requests/json-rpc');
const { SYSTEM_ERROR } = require('./constants');

describe('tests json-rpc request protocol', () => {
  beforeEach(() => {
    delete global.window;
  });

  describe('positive response', () => {
    test('test request one', async () => {
      const data = await JSONRPCRequest(JSONRPCSchemaTwo);

      expect(data).toEqual({
        additionalErrors: null,
        data: { foo: '1', index: 123 },
        error: false,
        errorText: '',
      });
    });
  });

  describe('negative response', () => {
    test('get error in ru', async () => {
      const data = await JSONRPCNegativeRequest(JSONRPCSchemaTwo);

      expect(data).toEqual({
        additionalErrors: {
          err: 'Тестовая ошибка',
          value1: '1',
          value2: '2',
          trKey: 'test.key.tr',
        },
        data: {},
        error: true,
        errorText:
          'trans func returns translation with key test.key.tr {"err":"Тестовая ошибка","trKey":"test.key.tr","value1":"1","value2":"2"}',
      });
    });

    test('get error in en', async () => {
      const data = await JSONRPCNegativeRequestEn(JSONRPCSchemaTwo);

      expect(data).toEqual({
        additionalErrors: {
          err: 'Тестовая ошибка',
          value1: '1',
          value2: '2',
          trKey: 'test.key.tr',
        },
        data: {},
        error: true,
        errorText:
          'trans func returns translation with key test.key.tr {"err":"Тестовая ошибка","trKey":"test.key.tr","value1":"1","value2":"2"}',
      });
    });

    test('get straight error text from server', async () => {
      const data = await JSONRPCNegativeErrorsRequestStraightError(
        JSONRPCSchemaTwo,
      );

      expect(data).toEqual({
        additionalErrors: {
          err: 'Тестовая ошибка',
          value1: '1',
          value2: '2',
          trKey: 'test.key.tr',
        },
        data: {},
        error: true,
        errorText: 'Тестовая ошибка',
      });
    });

    test('get request with extra handler validation callback, callback returns true', async () => {
      const extraValidationCallback = () => true;

      const data = await JSONRPCRequestWithCustomResponseValidation({
        responseSchema: JSONRPCSchemaTwo,
        extraValidationCallback,
      });

      expect(data).toEqual({
        additionalErrors: null,
        data: { foo: '1', index: 123 },
        error: false,
        errorText: '',
      });
    });

    test('get request with extra handler validation callback, callback returns false', async () => {
      const extraValidationCallback = () => false;

      const data = await JSONRPCRequestWithCustomResponseValidation({
        responseSchema: JSONRPCSchemaTwo,
        extraValidationCallback,
      });

      expect(data).toEqual(SYSTEM_ERROR);
    });
  });

  describe('negative response with no additionalErrors field', () => {
    test('test request one', async () => {
      const data = await JSONRPCNegativeErrorsRequest(JSONRPCSchemaTwo);

      expect(data).toEqual(SYSTEM_ERROR);
    });
  });

  describe('not valid schema response', () => {
    test('test request one', async () => {
      const data = await JSONRPCRequest(JSONRPCSchemaOne);

      expect(data).toEqual(SYSTEM_ERROR);
    });
  });
});
