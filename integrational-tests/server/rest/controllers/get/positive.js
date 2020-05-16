const mockPositiveData = {
  foo: "foo",
  bar: {
    baz: 0,
  },
  delta: ["1", "2"],
};

module.exports.positiveGetController = (req, res) => {
  const { specialparameter, pureresponse } = req.query;
  const { specialheader } = req.headers;

  if (specialheader) {
    if (pureresponse) {
      return res.status(200).json({
        ...mockPositiveData,
        specialheader: req.headers.specialheader,
      });
    }

    return res.status(200).json({
      error: false,
      errorText: "",
      data: { ...mockPositiveData, specialheader: req.headers.specialheader },
      additionalErrors: null,
    });
  }

  if (specialparameter) {
    return res.status(200).json({
      error: false,
      errorText: "",
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
    errorText: "",
    data: mockPositiveData,
    additionalErrors: null,
  });
};
