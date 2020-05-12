module.exports.positiveGetBlobController = (req, res) => {
  const params = req.query;
  console.info('positiveGetBlobController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};

module.exports.negativeGetBlobController = (req, res) => {
  const params = req.query;
  console.info('negativeGetBlobController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};
