const express = require('express');
const { negativeGetController } = require('../controllers/get/negative');
const { negativeGetBlobController } = require('../controllers/get-blob');
const { negativeGetTextController } = require('../controllers/get-text');
const { negativePostController } = require('../controllers/post/negative');
const { negativePutController } = require('../controllers/put/negative');
const { negativePatchController } = require('../controllers/patch/negative');
const { negativeDeleteController } = require('../controllers/delete/negative');

const negativeRouter = express.Router();

negativeRouter.get('/', negativeGetController);
negativeRouter.get('/blob', negativeGetBlobController);
negativeRouter.get('/text', negativeGetTextController);
negativeRouter.post('/', negativePostController);
negativeRouter.put('/', negativePutController);
negativeRouter.patch('/', negativePatchController);
negativeRouter.delete('/', negativeDeleteController);

module.exports.negativeRouter = negativeRouter;
