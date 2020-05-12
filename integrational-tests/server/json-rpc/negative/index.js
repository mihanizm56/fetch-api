const express = require('express');
const { negativeController } = require('../controllers');

const negativeRouter = express.Router();

negativeRouter.post('/', negativeController);

module.exports.negativeRouter = negativeRouter;
