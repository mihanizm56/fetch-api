module.exports.positivePutController = (req, res) => {
  const params = req.query;
  console.info('positivePutController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};

module.exports.negativePutController = (req, res) => {
  const params = req.query;
  console.info('negativePutController get request', params);

  res.status(200).json({
    error: false,
    errorText: '',
    data: {},
  });
};
