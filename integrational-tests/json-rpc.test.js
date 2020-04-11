const { JSONRPCSchemaOne, JSONRPCSchemaTwo } = require('./schemas/json-rpc');
const {
  JSONRPCRequest,
  JSONRPCNegativeRequest,
  JSONRPCNegativeRequestEn,
  JSONRPCNegativeErrorsRequest,
  JSONRPCNegativeErrorsRequestStraightError,
} = require('./requests/json-rpc');

describe('tests rest request protocol', () => {
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
        additionalErrors: { err: 'test error', trKey: 'test' },
        data: null,
        error: true,
        errorText: 'Тестовая ошибка',
      });
    });

    test('get error in en', async () => {
      const data = await JSONRPCNegativeRequestEn(JSONRPCSchemaTwo);

      expect(data).toEqual({
        additionalErrors: { err: 'test error', trKey: 'test' },
        data: null,
        error: true,
        errorText: 'Test error',
      });
    });

    test('get straight error text from server', async () => {
      const data = await JSONRPCNegativeErrorsRequestStraightError(
        JSONRPCSchemaTwo,
      );

      expect(data).toEqual({
        additionalErrors: { err: 'test error', trKey: 'test' },
        data: null,
        error: true,
        errorText: 'test error',
      });
    });
  });

  describe('negative response with not additionalErrors field', () => {
    test('test request one', async () => {
      const data = await JSONRPCNegativeErrorsRequest(JSONRPCSchemaTwo);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText: 'Системная ошибка',
      });
    });
  });

  describe('not valid response', () => {
    test('test request one', async () => {
      const data = await JSONRPCRequest(JSONRPCSchemaOne);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText: 'Системная ошибка',
      });
    });
  });
});
