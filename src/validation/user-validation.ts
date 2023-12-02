import Joi from "joi";

const userCurrentValidation: Joi.StringSchema = Joi.string()
  .max(200)
  .required();

export { userCurrentValidation };
