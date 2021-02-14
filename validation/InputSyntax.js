const joi = require("@hapi/joi");

const loginValidation = (body) => {
  const schema = joi.object({
    user: joi.string().min(4).required(),
    password: joi.string().min(6).required(),
  });

  return schema.validate(body);
};

const registerValidation = (body) => {
  const schema = joi.object({
    userName: joi.string().min(4).required(),
    email: joi.string().min(4).required().email(),
    password: joi.string().min(6).required(),
  });

  return schema.validate(body);
};

module.exports = {
  loginValidation,
  registerValidation,
};
