module.exports.positivePatchController = (req, res) => {
  const params = req.query;
  console.info('positivePatchController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};

module.exports.negativePatchController = (req, res) => {
  const params = req.query;
  console.info('negativePatchController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};
