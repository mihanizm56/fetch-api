module.exports.negativePatchController = (req, res) => {
  const {
    errorwithadditionalerrors,
    pureresponse,
    internalerror,
    notsentadderr,
    notsentdata,
    notsenterror,
    notsenterrortext,
    straighterror,
    errorastext,
    errortextexist,
  } = req.query;

  if (pureresponse) {
    if (internalerror) {
      return res.status(501).json({
        errorText: 'test int error',
      });
    }

    if (straighterror) {
      return res.status(403).json({
        errorText: 'test straight error',
        additionalErrors: { foo: 1 },
      });
    }

    if (errorwithadditionalerrors) {
      return res.status(400).json({
        errorText: 'test errors with additional params',
        additionalErrors: { foo: 1 },
      });
    }

    if (errorastext) {
      if (errortextexist) {
        return res.status(403).json({
          error: 'empty test error in errorText',
          errorText: '',
        });
      }

      return res.status(403).json({
        error: 'text in error',
      });
    }

    return res.status(403).json({
      errorText: 'test errors with additional params',
    });
  }

  if (errorwithadditionalerrors) {
    return res.status(402).json({
      error: true,
      errorText: 'test errors with additional params',
      data: null,
      additionalErrors: { parameter: 1 },
    });
  }

  if (internalerror) {
    return res.status(501).json({
      error: true,
      errorText: 'not matter error value',
      data: null,
      additionalErrors: { parameter: 1 },
    });
  }

  if (notsentadderr) {
    return res.status(400).json({
      error: true,
      errorText: 'not matter error value',
      data: null,
    });
  }

  if (notsentdata) {
    return res.status(400).json({
      error: true,
      errorText: 'not matter error value',
      data: null,
    });
  }

  if (notsenterror) {
    return res.status(400).json({
      error: true,
      errorText: 'not matter error value',
      data: null,
    });
  }

  if (notsenterrortext) {
    return res.status(400).json({
      error: true,
      errorText: 'not matter error value',
      data: null,
    });
  }

  res.status(400).json({
    error: true,
    errorText: 'test error',
    data: null,
    additionalErrors: null,
  });
};
