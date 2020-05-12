module.exports.positivePostController = (req, res) => {
  const params = req.query;
  console.info('positivePostController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};

module.exports.negativePostController = (req, res) => {
  const params = req.query;
  console.info('negativePostController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};
