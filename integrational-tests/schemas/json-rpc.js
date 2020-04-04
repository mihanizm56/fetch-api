const Joi = require('@hapi/joi');

module.exports.JSONRPCSchemaOne = Joi.object({
  foo: Joi.string().required(),
});

module.exports.JSONRPCSchemaTwo = Joi.object({
  foo: Joi.string().required(),
  index: Joi.number().required(),
});
