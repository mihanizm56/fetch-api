const path = require('path');

const filepath = path.join(__dirname, 'test.css');

module.exports.positiveGetTextController = (req, res) => {
  res.sendFile(filepath);
};

module.exports.negativeGetTextController = (req, res) => {
  res.status(500).send();
};
