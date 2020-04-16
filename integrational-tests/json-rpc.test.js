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
        additionalErrors: { err: 'Тестовая ошибка', trKey: 'test' },
        data: null,
        error: true,
        errorText: 'Тестовая ошибка',
      });
    });

    test('get error in en', async () => {
      const data = await JSONRPCNegativeRequestEn(JSONRPCSchemaTwo);

      expect(data).toEqual({
        additionalErrors: { err: 'Тестовая ошибка', trKey: 'test' },
        data: null,
        error: true,
        errorText: 'Тестовая ошибка',
      });
    });

    test('get straight error text from server', async () => {
      const data = await JSONRPCNegativeErrorsRequestStraightError(
        JSONRPCSchemaTwo,
      );

      expect(data).toEqual({
        additionalErrors: { err: 'Тестовая ошибка', trKey: 'test' },
        data: null,
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

  describe('negative response with not additionalErrors field', () => {
    test('test request one', async () => {
      const data = await JSONRPCNegativeErrorsRequest(JSONRPCSchemaTwo);

      expect(data).toEqual(SYSTEM_ERROR);
    });
  });

  describe('not valid response', () => {
    test('test request one', async () => {
      const data = await JSONRPCRequest(JSONRPCSchemaOne);

      expect(data).toEqual(SYSTEM_ERROR);
    });
  });
});
