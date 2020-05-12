const express = require('express');
const { negativeRouter } = require('./negative');
const { positiveRouter } = require('./positive');

const rpcRootRouter = express.Router();

rpcRootRouter.use('/positive', positiveRouter);
rpcRootRouter.use('/negative', negativeRouter);

module.exports.rpcRootRouter = rpcRootRouter;
