const express = require('express');
const {
  retryRPCController,
  retryRestController,
  retryPureRestController,
} = require('../controllers/retry');

const retryRouter = express.Router();

retryRouter.post('/json-rpc', retryRPCController);
retryRouter.get('/rest', retryRestController);
retryRouter.get('/pure-rest', retryPureRestController);

module.exports.retryRouter = retryRouter;
