const mockPositiveData = {
  foo: "foo",
  bar: {
    baz: 0,
  },
};

const sendSuccessDataRPC = (code, res, id, data) =>
  res.status(code).json({
    jsonrpc: "2.0",
    id,
    result: data,
  });

module.exports.positiveRPCController = (req, res) => {
  const { id } = req.body;
  const { specialheader } = req.headers;
  const { specialqueryparam } = req.query;

  if (specialheader) {
    return sendSuccessDataRPC(200, res, id, {
      ...mockPositiveData,
      specialheader,
    });
  }

  if (specialqueryparam) {
    return sendSuccessDataRPC(200, res, id, {
      ...mockPositiveData,
      specialqueryparam: "specialqueryparam",
    });
  }

  return sendSuccessDataRPC(200, res, id, mockPositiveData);
};
