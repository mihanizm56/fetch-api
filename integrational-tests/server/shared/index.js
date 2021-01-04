const express = require('express');
const { retryRouter } = require('./retry');

const sharedRootRouter = express.Router();

sharedRootRouter.use('/retry', retryRouter);

module.exports.sharedRootRouter = sharedRootRouter;
