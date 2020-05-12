const express = require('express'); // eslint-disable-line
const logger = require('morgan'); // eslint-disable-line
const bodyParser = require('body-parser'); // eslint-disable-line
const { restRootRouter } = require('./rest'); // eslint-disable-line
const { rpcRootRouter } = require('./json-rpc'); // eslint-disable-line

const app = express();
const PORT = 8080;

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// negative rest
app.use('/rest', restRootRouter);
app.use('/json-rpc', rpcRootRouter);

// eslint-disable-next-line
app.listen(PORT, () => console.info(`mock server started on port ${PORT}`));
