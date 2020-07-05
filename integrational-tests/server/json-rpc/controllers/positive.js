const mockPositiveData = {
  foo: 'foo',
  bar: {
    baz: 0,
  },
};

const sendSuccessDataRPC = (code, res, id, data) =>
  res.status(code).json({
    jsonrpc: '2.0',
    id,
    result: data,
  });

module.exports.positiveRPCController = (req, res) => {
  const { id } = req.body;
  const { specialheader } = req.headers;
  const {
    specialqueryparamBoolean,
    specialqueryparamNumber,
    specialqueryparamString,
    specialqueryparamArray,
  } = req.query;

  const areQueryParamsForCheckExist =
    specialqueryparamBoolean &&
    specialqueryparamNumber &&
    specialqueryparamString &&
    specialqueryparamArray;

  if (specialheader) {
    return sendSuccessDataRPC(200, res, id, {
      ...mockPositiveData,
      specialheader,
    });
  }

  if (areQueryParamsForCheckExist) {
    return sendSuccessDataRPC(200, res, id, {
      ...mockPositiveData,
      specialqueryparamBoolean,
      specialqueryparamNumber,
      specialqueryparamString,
      specialqueryparamArray,
    });
  }

  return sendSuccessDataRPC(200, res, id, mockPositiveData);
};
