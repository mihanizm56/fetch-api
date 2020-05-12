const path = require('path');

const filepath = path.join(__dirname, 'photo.jpg');

module.exports.positiveGetBlobController = (req, res) => {
  const params = req.query;
  console.info('positiveGetBlobController get request', params);

  res.sendFile(filepath);
};

module.exports.negativeGetBlobController = (req, res) => {
  const params = req.query;
  console.info('negativeGetBlobController get request', params);

  res.status(500).send();
};
