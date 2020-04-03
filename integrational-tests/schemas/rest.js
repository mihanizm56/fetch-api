const Joi = require('@hapi/joi');

module.exports.getRestSchema = Joi.object({
  foo: Joi.string().required(),
});

module.exports.postRestSchema = Joi.object({
  foo: Joi.string().required(),
  index: Joi.number().required(),
});

module.exports.putRestSchema = Joi.object({
  putField: Joi.number().required(),
});

module.exports.patchRestSchema = Joi.object({
  test: [Joi.string().required(), null],
});

module.exports.deleteRestSchema = Joi.object({
  test: [Joi.string().required(), null],
});
