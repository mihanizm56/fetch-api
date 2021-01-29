const express = require('express');
const { positiveGetController } = require('../controllers/get/positive');
const { positiveGetBlobController } = require('../controllers/get-blob');
const { positiveGetTextController } = require('../controllers/get-text');
const { positivePostController } = require('../controllers/post/positive');
const { positivePutController } = require('../controllers/put/positive');
const { positivePatchController } = require('../controllers/patch/positive');
const { positiveDeleteController } = require('../controllers/delete/positive');

const positiveRouter = express.Router();

positiveRouter.get('/', positiveGetController);
positiveRouter.get('/blob', positiveGetBlobController);
positiveRouter.get('/text', positiveGetTextController);
positiveRouter.post('/', positivePostController);
positiveRouter.put('/', positivePutController);
positiveRouter.patch('/', positivePatchController);
positiveRouter.delete('/', positiveDeleteController);

module.exports.positiveRouter = positiveRouter;
