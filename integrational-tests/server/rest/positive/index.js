const express = require('express');
const { positiveGetController } = require('../controllers/get');
const { positivePostController } = require('../controllers/post');
const { positivePutController } = require('../controllers/put');
const { positivePatchController } = require('../controllers/patch');
const { positiveDeleteController } = require('../controllers/delete');

const positiveRouter = express.Router();

positiveRouter.get('/', positiveGetController);
positiveRouter.post('/', positivePostController);
positiveRouter.put('/', positivePutController);
positiveRouter.patch('/', positivePatchController);
positiveRouter.delete('/', positiveDeleteController);

module.exports.positiveRouter = positiveRouter;
