const COUNTERS = {
  'json-rpc': 1,
  rest: 1,
  'pure-rest': 1,
};

const sendErrorDataRPC = (code, version, res, id, error) =>
  res.status(code).json({
    jsonrpc: version,
    id,
    error,
  });

const sendSuccessDataRPC = (code, res, id, data) =>
  res.status(code).json({
    jsonrpc: '2.0',
    id,
    result: data,
  });

module.exports.retryRPCController = (req, res) => {
  const { id } = req.body;
  const { success, last, notresponded, retrynumber } = req.query;

  if (success) {
    return sendSuccessDataRPC(200, res, req.body.id, {});
  }

  if (notresponded) {
    return sendErrorDataRPC(400, '1.0', res, id, {
      code: 401,
      message: 'test retry error',
      data: {
        err: 'test retry error err',
        trKey: 'test retry error trKey',
      },
    });
  }

  if (last && retrynumber) {
    if (COUNTERS['json-rpc'] === Number(retrynumber)) {
      return sendSuccessDataRPC(200, res, req.body.id, {});
    }

    COUNTERS['json-rpc'] += 1;

    return sendErrorDataRPC(400, '1.0', res, id, {
      code: 401,
      message: 'test retry error',
      data: {
        err: 'test retry error err',
        trKey: 'test retry error trKey',
      },
    });
  }
};

module.exports.retryRestController = (req, res) => {
  const { success, last, notresponded, retrynumber } = req.query;

  if (success) {
    return res.status(200).json({
      error: false,
      errorText: '',
      data: {},
      additionalErrors: null,
    });
  }

  if (notresponded) {
    return res.status(400).json({
      error: true,
      errorText: 'test retry error',
      data: null,
      additionalErrors: null,
    });
  }

  if (last && retrynumber) {
    if (COUNTERS.rest === Number(retrynumber)) {
      return res.status(200).json({
        error: false,
        errorText: '',
        data: {},
        additionalErrors: null,
      });
    }

    COUNTERS.rest += 1;

    return res.status(400).json({
      error: true,
      errorText: 'test retry error',
      data: null,
      additionalErrors: null,
    });
  }
};

module.exports.retryPureRestController = (req, res) => {
  const { success, last, notresponded, retrynumber } = req.query;

  if (success) {
    return res.status(200).json({});
  }

  if (notresponded) {
    return res.status(400).json({});
  }

  if (last && retrynumber) {
    if (COUNTERS['pure-rest'] === Number(retrynumber)) {
      return res.status(200).json({});
    }

    COUNTERS['pure-rest'] += 1;

    return res.status(400).json({});
  }
};
