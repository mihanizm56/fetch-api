const express = require('express');
const { negativeGetController } = require('../controllers/get');
const { negativePostController } = require('../controllers/post');
const { negativePutController } = require('../controllers/put');
const { negativePatchController } = require('../controllers/patch');
const { negativeDeleteController } = require('../controllers/delete');

const negativeRouter = express.Router();

negativeRouter.get('/', negativeGetController);
negativeRouter.post('/', negativePostController);
negativeRouter.put('/', negativePutController);
negativeRouter.patch('/', negativePatchController);
negativeRouter.delete('/', negativeDeleteController);

module.exports.negativeRouter = negativeRouter;
