const mockPositiveData = {
  foo: 'foo',
  bar: {
    baz: 0,
  },
};

module.exports.positivePostController = (req, res) => {
  const { queryparam, pureresponse, getcontenttype } = req.query;
  const { specialheader } = req.headers;
  const { bodyparam } = req.body;

  if (getcontenttype) {
    return res.status(200).json({
      additionalErrors: null,
      data: {
        headerValue: req.headers['content-type'],
      },
      error: false,
      errorText: '',
    });
  }

  if (pureresponse) {
    if (bodyparam) {
      return res.status(200).json({ ...mockPositiveData, bodyparam });
    }

    return res.status(200).json(mockPositiveData);
  }

  if (bodyparam) {
    return res.status(200).json({
      error: false,
      errorText: '',
      data: { ...mockPositiveData, bodyparam },
      additionalErrors: null,
    });
  }

  if (queryparam) {
    return res.status(200).json({
      error: false,
      errorText: '',
      data: { ...mockPositiveData, queryparam },
      additionalErrors: null,
    });
  }

  if (specialheader) {
    if (pureresponse) {
      return res.status(200).json({
        ...mockPositiveData,
        specialheader: req.headers.specialheader,
      });
    }

    return res.status(200).json({
      error: false,
      errorText: '',
      data: { ...mockPositiveData, specialheader: req.headers.specialheader },
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
