module.exports.positiveController = (req, res) => {
  const params = req.query;
  console.info('positiveController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};

module.exports.negativeController = (req, res) => {
  const params = req.query;
  console.info('negativeController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};
