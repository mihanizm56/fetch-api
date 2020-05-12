module.exports.positiveGetController = (req, res) => {
  const params = req.query;
  console.info('positiveGetController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};

module.exports.negativeGetController = (req, res) => {
  const params = req.query;
  console.info('negativeGetController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};
