const express = require('express');
const { positiveRPCController } = require('../controllers/positive');

const positiveRouter = express.Router();

positiveRouter.post('/', positiveRPCController);

module.exports.positiveRouter = positiveRouter;
