module.exports.positiveDeleteController = (req, res) => {
  const params = req.query;
  console.info('positiveDeleteController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};

module.exports.negativeDeleteController = (req, res) => {
  const params = req.query;
  console.info('negativeDeleteController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};
