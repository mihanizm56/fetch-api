const path = require('path');

const file = require('./test.json')

module.exports.positiveGetJSONController = (req, res) => {
  res.status(200).json(file);
};

module.exports.negativeGetJSONController = (req, res) => {
  res.status(500).send();
};
