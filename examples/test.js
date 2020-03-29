const Joi = require("@hapi/joi");
const { JSONRPCRequest } = require("../dist");

const createReviseRequest = async () => {
  const data = await new JSONRPCRequest().makeRequest({
    endpoint: "http://localhost:5000/api/v1/points/13",
    errorsMap: {
      TIMEOUT_ERROR: "Превышено ожидание запроса",
      REQUEST_DEFAULT_ERROR: "Системная ошибка"
    },
    // queryParams: {
    //   id: 13
    // },
    responseSchema:
      // Joi.array().items(
      Joi.object({
        likes: Joi.number()
      }),
    id: "123"
    // )
  });

  console.log("data", data);
};

createReviseRequest();
