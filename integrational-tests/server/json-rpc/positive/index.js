const express = require('express');
const { positiveController } = require('../controllers');

const positiveRouter = express.Router();

positiveRouter.post('/', positiveController);

module.exports.positiveRouter = positiveRouter;
