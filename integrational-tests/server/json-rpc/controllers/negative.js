const sendErrorDataRPC = (code, version, res, id, error) =>
  res.status(code).json({
    jsonrpc: version,
    id,
    error,
  });

module.exports.negativeRPCController = (req, res) => {
  const { id } = req.body;
  const { notsameversion, notsameid, notparsederror } = req.query;

  if (notsameversion) {
    return sendErrorDataRPC(400, '1.0', res, id, {
      code: 401,
      message: 'Тестовая ошибка 1',
      data: {
        err: 'Тестовая ошибка 1 err',
        trKey: 'test key 1',
        param1: 'test param 1',
      },
    });
  }

  if (notsameid) {
    return sendErrorDataRPC(400, '2.0', res, '12345_12123', {
      code: 403,
      message: 'Тестовая ошибка 2',
      data: {
        err: 'Тестовая ошибка 2 err',
        trKey: 'test key 2',
        param2: 'test param 2',
      },
    });
  }

  if (notparsederror) {
    return sendErrorDataRPC(400, '2.0', res, '12345_12123', {
      code: 501,
      message: 'Тестовая ошибка 3',
      data: {
        err: 'Тестовая ошибка 3 err',
        trKey: 'test key 3',
        param3: 'test param 3',
      },
    });
  }

  return sendErrorDataRPC(500, '2.0', res, id, {
    code: 500,
    message: 'Тестовая ошибка 4',
    data: {
      err: 'Тестовая ошибка 4 err',
      trKey: 'test key 4',
      param4: 'test param 4',
    },
  });
};
