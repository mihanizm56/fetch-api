module.exports.negativeGetController = (req, res) => {
  const {
    notvaliddata,
    internalerror,
    notfound,
    notvalidschema,
    notvalidstructuredata,
    notvalidbasestructure,
    notvalidstructureerror,
    notvalidstructureerrortext,
    notvalidstructureadditionalerrors,
    errorwithadditionalerrors,
    pureresponse,
    straighterror,
  } = req.query;

  if (notvaliddata) {
    return res.status(400).json({
      error: true,
      errorText: 'not valid data',
      data: null,
      additionalErrors: null,
    });
  }

  if (internalerror) {
    return res.status(501).json({
      error: true,
      errorText: 'internal server error',
      data: null,
      additionalErrors: null,
    });
  }

  if (notfound) {
    return res.status(404).json({
      error: true,
      errorText: 'not found',
      data: null,
      additionalErrors: null,
    });
  }

  if (pureresponse) {
    if (straighterror) {
      return res.status(400).json({
        errorText: 'straighterror',
        additionalErrors: { parameterText: 1 },
      });
    }

    return res.status(403).json({
      errorText: 'text',
      additionalErrors: { parameter: 1 },
    });
  }

  if (notvalidschema) {
    return res.status(200).json({
      error: false,
      errorText: '',
      data: {
        foo: 'bar',
        bar: {
          baz: 'not valid-string',
        },
        delta: ['1', '2'],
      },
      additionalErrors: null,
    });
  }

  if (notvalidstructuredata) {
    return res.status(200).json({
      error: false,
      errorText: '',
      response: {
        foo: 'bar',
        bar: {
          baz: 'not valid-string',
        },
        delta: ['1', '2'],
      },
      additionalErrors: null,
    });
  }

  if (notvalidstructureerror) {
    return res.status(200).json({
      errorText: '',
      data: {
        foo: 'bar',
        bar: {
          baz: 'not valid-string',
        },
        delta: ['1', '2'],
      },
      additionalErrors: null,
    });
  }

  if (notvalidstructureerrortext) {
    return res.status(200).json({
      error: false,
      data: {
        foo: 'bar',
        bar: {
          baz: 'not valid-string',
        },
        delta: ['1', '2'],
      },
      additionalErrors: null,
    });
  }

  if (notvalidstructureadditionalerrors) {
    return res.status(200).json({
      error: false,
      errorText: '',
      data: {
        foo: 'bar',
        bar: {
          baz: 'not valid-string',
        },
        delta: ['1', '2'],
      },
    });
  }

  if (errorwithadditionalerrors) {
    return res.status(400).json({
      error: true,
      errorText: 'test special key',
      data: null,
      additionalErrors: {
        foo: 'bar',
        baz: 1,
      },
    });
  }

  if (notvalidbasestructure) {
    return res.status(400).json({
      error: true,
      errorText: 'test special key',
      data: null,
    });
  }

  res.status(401).json({
    error: true,
    errorText: 'test error key',
    data: {},
    additionalErrors: null,
  });
};
