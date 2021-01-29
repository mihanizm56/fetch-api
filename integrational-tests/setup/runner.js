const express = require('express');
const logger = require('morgan');
// const cors = require('cors');
const bodyParser = require('body-parser');
const { restRootRouter } = require('../server/rest');
const { rpcRootRouter } = require('../server/json-rpc');
const { sharedRootRouter } = require('../server/shared');

const app = express();
const PORT = 8080;

// middlewares
// app.use(cors({ origin: '*' }));
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// negative rest
app.use('/rest', restRootRouter);
app.use('/json-rpc', rpcRootRouter);
app.use('/shared', sharedRootRouter);

module.exports = async () => {
  const server = app.listen(PORT, () => {
    console.info(`mock server started on port ${PORT}`);
  });

  global.server = server;
};

// TO RUN SERVER WITHOUT JEST
// app.listen(PORT, () => {
//   console.info(`mock server started on port ${PORT}`);
// });
