const express = require('express');
const { negativeRouter } = require('./negative');
const { positiveRouter } = require('./positive');

const restRootRouter = express.Router();

restRootRouter.use('/positive', positiveRouter);
restRootRouter.use('/negative', negativeRouter);

module.exports.restRootRouter = restRootRouter;
