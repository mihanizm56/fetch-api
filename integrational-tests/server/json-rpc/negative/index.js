const express = require('express');
const { negativeRPCController } = require('../controllers/negative');

const negativeRouter = express.Router();

negativeRouter.post('/', negativeRPCController);

module.exports.negativeRouter = negativeRouter;
