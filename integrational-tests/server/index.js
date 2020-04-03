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
    errorText: 'test error',
    additionalErrors: {
      username: 'not valid data',
    },
    data: {},
  });

// positive rest
app.get('/rest', (req, res) => sendSuccessData(res, { foo: 'bar' }));
app.post('/rest', (req, res) => {
  console.log('//////', req.body);

  sendSuccessData(res, { foo: 'bar', index: 1 });
});
app.put('/rest', (req, res) =>
  // console.log(req.body) ||
  sendSuccessData(res, { putField: 123 }),
);
app.patch('/rest', (req, res) =>
  // console.log(req.body) ||
  sendSuccessData(res, {
    test: 'test',
  }),
);
app.delete('/rest', (req, res) =>
  // console.log(req.body) ||
  sendSuccessData(res, { test: null }),);

// negative rest
app.get('/rest/negative', (req, res) => sendNegativeData(res));
app.post('/rest/negative', (req, res) => sendNegativeData(res));
app.put('/rest/negative', (req, res) => sendNegativeData(res));
app.patch('/rest/negative', (req, res) => sendNegativeData(res));
app.delete('/rest/negative', (req, res) => sendNegativeData(res));

// eslint-disable-next-line
app.listen(PORT, () => console.info(`mock server started on port ${PORT}`));
