const path = require('path');

const filepath = path.join(__dirname, 'photo.jpg');

module.exports.positiveGetBlobController = (req, res) => {
  res.sendFile(filepath);
};

module.exports.negativeGetBlobController = (req, res) => {
  res.status(500).send();
};
