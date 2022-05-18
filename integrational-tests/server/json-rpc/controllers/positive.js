const mockPositiveData = {
  foo: 'foo',
  bar: {
    baz: 0,
  },
};

const mockPositiveBatchOneItemData = [
  {
    result: mockPositiveData,
  },
];

const mockPositiveBatchTwoItemsData = [
  {
    result: mockPositiveData,
  },
  {
    result: {
      countries: [
        {
          id: 'e128ce0f-852b-5c3c-9b95-f3d9829cc2a2',
          value: 'ru-RU',
          label: 'country.label.RU',
        },
        {
          id: '84fbd842-4051-5702-a638-79bdb73a8f7e',
          value: 'pl-PL',
          label: 'country.label.PL',
        },
      ],
    },
  },
];

const sendSuccessDataRPC = (code, res, id, data) =>
  res.status(code).json({
    jsonrpc: '2.0',
    id,
    result: data,
  });

module.exports.positiveRPCController = (req, res) => {
  const { specialheader } = req.headers;
  const {
    specialqueryparamBoolean,
    specialqueryparamNumber,
    specialqueryparamString,
    specialqueryparamArray,
    batch,
    oneSchema,
    twoSchemas,
    randomIds,
    notCorrectIds,
  } = req.query;

  const areQueryParamsForCheckExist =
    specialqueryparamBoolean &&
    specialqueryparamNumber &&
    specialqueryparamString &&
    specialqueryparamArray;

  if (specialheader) {
    return sendSuccessDataRPC(200, res, req.body.id, {
      ...mockPositiveData,
      specialheader,
    });
  }

  if (areQueryParamsForCheckExist) {
    return sendSuccessDataRPC(200, res, req.body.id, {
      ...mockPositiveData,
      specialqueryparamBoolean,
      specialqueryparamNumber,
      specialqueryparamString,
      specialqueryparamArray,
    });
  }

  if (batch) {
    if (oneSchema) {
      const enrichedData = mockPositiveBatchOneItemData.map(
        (responseItem, index) => ({
          ...responseItem,
          jsonrpc: '2.0',
          id: req.body[index].id,
        }),
      );

      return res.status(200).json(enrichedData);
    }
    if (twoSchemas) {
      const enrichedData = mockPositiveBatchTwoItemsData.map(
        (responseItem, index) => ({
          ...responseItem,
          jsonrpc: '2.0',
          id: req.body[index].id,
        }),
      );

      return res.status(200).json(enrichedData);
    }
    if (randomIds) {
      return res.status(200).json([
        {
          jsonrpc: '2.0',
          id: req.body[1].id,
          result: {
            countries: [
              {
                id: 'e128ce0f-852b-5c3c-9b95-f3d9829cc2a2',
                value: 'ru-RU',
                label: 'country.label.RU',
              },
              {
                id: '84fbd842-4051-5702-a638-79bdb73a8f7e',
                value: 'pl-PL',
                label: 'country.label.PL',
              },
            ],
          },
        },
        {
          jsonrpc: '2.0',
          id: req.body[0].id,
          result: mockPositiveData,
        },
      ]);
    }

    if (notCorrectIds) {
      return res.status(200).json([
        {
          jsonrpc: '2.0',
          id: '123',
          result: {
            countries: [
              {
                id: 'e128ce0f-852b-5c3c-9b95-f3d9829cc2a2',
                value: 'ru-RU',
                label: 'country.label.RU',
              },
              {
                id: '84fbd842-4051-5702-a638-79bdb73a8f7e',
                value: 'pl-PL',
                label: 'country.label.PL',
              },
            ],
          },
        },
        {
          jsonrpc: '2.0',
          id: '121121',
          result: mockPositiveData,
        },
      ]);
    }
  }

  return sendSuccessDataRPC(200, res, req.body.id, mockPositiveData);
};
