const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const { restRootRouter } = require('../server/rest');
const { rpcRootRouter } = require('../server/json-rpc');

const app = express();
const PORT = 8080;

// middlewares
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// negative rest
app.use('/rest', restRootRouter);
app.use('/json-rpc', rpcRootRouter);

// eslint-disable-next-line

module.exports = async () => {
  const server = app.listen(PORT, () =>
    console.info(`mock server started on port ${PORT}`),
  );

  global.server = server;
};
