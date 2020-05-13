const mockPositiveData = {
  foo: 'foo',
  bar: {
    baz: 0,
  },
  delta: ['1', '2'],
};

module.exports.positiveGetController = (req, res) => {
  const { specialparameter } = req.query;
  const { specialheader } = req.headers;
  console.info('positiveGetController get request', req.query);

  if (specialheader) {
    return res.status(200).json({
      error: false,
      errorText: '',
      data: { ...mockPositiveData, specialheader: req.headers.specialheader },
      additionalErrors: null,
    });
  }

  if (specialparameter) {
    return res.status(200).json({
      error: false,
      errorText: '',
      data: {
        ...mockPositiveData,
        specialparameter: req.query.specialparameter,
      },
      additionalErrors: null,
    });
  }

  res.status(200).json({
    error: false,
    errorText: '',
    data: mockPositiveData,
    additionalErrors: null,
  });
};

module.exports.negativeGetController = (req, res) => {
  const {
    notvaliddata,
    internalerror,
    notfound,
    notvalidschema,
    notvalidstructuredata,
    notvalidstructureerror,
    notvalidstructureerrortext,
    notvalidstructureadditionalerrors,
    errorwithadditionalerrors,
  } = req.query;
  console.info('negativeGetController get request', req.query);

  if (notvaliddata) {
    return res.status(400).json({
      error: true,
      errorText: 'not valid data',
      data: null,
      additionalErrors: null,
    });
  }

  if (internalerror) {
    return res.status(500).json({
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

  res.status(200).json({
    error: true,
    errorText: 'test error key',
    data: {},
    additionalErrors: null,
  });
};
