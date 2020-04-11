const express = require('express'); // eslint-disable-line
const logger = require('morgan'); // eslint-disable-line
const bodyParser = require('body-parser'); // eslint-disable-line

const app = express();
const PORT = 8080;

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const sendSuccessData = (res, data) =>
  res
    .status(200)
    .json({ error: false, errorText: '', additionalErrors: null, data });

const sendNegativeData = res =>
  res.status(400).json({
    error: true,
    errorText: 'test',
    additionalErrors: {
      username: 'not valid data',
    },
    data: {},
  });

const sendSuccessDataRPC = (res, id, data) =>
  res.status(200).json({
    jsonrpc: '2.0',
    id,
    result: data,
  });

const sendNegativeDataRPC = (res, id) =>
  res.status(200).json({
    jsonrpc: '2.0',
    id,
    error: {
      code: 500,
      message: 'test error message',
      data: {
        err: 'test error',
        trKey: 'test',
      },
    },
  });

const sendNegativeErrorDataRPC = (res, id) =>
  res.status(200).json({
    jsonrpc: '2.0',
    id,
    error: {
      code: 500,
      message: 'test error',
    },
  });

// positive rest
app.get('/rest', (req, res) => sendSuccessData(res, { foo: 'bar' }));
app.post('/rest', (req, res) => sendSuccessData(res, { foo: 'bar', index: 1 }));
app.put('/rest', (req, res) => sendSuccessData(res, { putField: 123 }));
app.delete('/rest', (req, res) => sendSuccessData(res, { test: null }));
app.patch('/rest', (req, res) => {
  sendSuccessData(res, {
    test: 'test',
  });
});

// negative rest
app.get('/rest/negative', (req, res) => sendNegativeData(res));
app.post('/rest/negative', (req, res) => sendNegativeData(res));
app.put('/rest/negative', (req, res) => sendNegativeData(res));
app.patch('/rest/negative', (req, res) => sendNegativeData(res));
app.delete('/rest/negative', (req, res) => sendNegativeData(res));

// positive json-rpc
app.post('/json-rpc', (req, res) => {
  const { id } = req.body;

  sendSuccessDataRPC(res, id, {
    foo: '1',
    index: 123,
  });
});

// negative json-rpc
app.post('/json-rpc/negative', (req, res) => {
  const { id } = req.body;

  sendNegativeDataRPC(res, id);
});

// negative json-rpc with no additionalErrors
app.post('/json-rpc/negative', (req, res) => {
  const { id } = req.body;

  sendNegativeErrorDataRPC(res, id);
});

// eslint-disable-next-line
app.listen(PORT, () => console.info(`mock server started on port ${PORT}`));
