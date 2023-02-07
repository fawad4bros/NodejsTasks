const joi = require("joi");
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const signUpReqSchema = joi.object({
  username: joi.string().min(5).max(255).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).max(1024).required(),
});
const paginationSchema = joi.object({
  page: joi.string().required(),
  limit: joi.string().required(),
});
const updateReqSchema = joi.object({
  username: joi.string().min(5).max(255).required(),
  email: joi.string().email().required(),
  _id: joi.string().required(),
});
module.exports = {
  signUpReqValid : validator(signUpReqSchema),
  paginationValid: validator(paginationSchema),
  updateReqValid: validator(updateReqSchema)
}

//https://github.com/hapijs/joi/blob/v17.4.0/API.md#list-of-errors
/*
.messages({
    "string.base": `"a" should be a type of 'text'`,
    "string.empty": `"a" cannot be an empty field`,
    "string.min": `"a" should have a minimum length of ${err.local.limit}`, Joi v17.4.0
    "any.required": `"a" is a required field`,
  })
*/