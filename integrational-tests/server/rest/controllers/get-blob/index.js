const path = require('path');

const filepath = path.join(__dirname, 'photo.jpg');

module.exports.positiveGetBlobController = (req, res) => {
  const params = req.query;

  res.sendFile(filepath);
};

module.exports.negativeGetBlobController = (req, res) => {
  const params = req.query;

  res.status(500).send();
};
