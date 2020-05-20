const mockPositiveData = {
  foo: 'foo',
  bar: {
    baz: 0,
  },
  delta: ['1', '2'],
};

const mockArrayData = [
  {
    username: 'username1',
    count: 1,
  },
  {
    username: 'username2',
    count: 2,
  },
];

module.exports.positiveGetController = (req, res) => {
  const { specialparameter, pureresponse, isempty, getsimplearray } = req.query;
  const { specialheader } = req.headers;

  if (pureresponse) {
    if (getsimplearray) {
      return res.status(200).json(mockArrayData);
    }

    if (isempty) {
      return res.status(204).send();
    }
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

  if (pureresponse) {
    return res.status(200).json(mockPositiveData);
  }

  res.status(200).json({
    error: false,
    errorText: '',
    data: mockPositiveData,
    additionalErrors: null,
  });
};
