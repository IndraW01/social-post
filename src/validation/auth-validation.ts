import Joi, { ObjectSchema } from "joi";

const authRegisterValidation: ObjectSchema = Joi.object({
  name: Joi.string().max(200).required(),
  username: Joi.string().max(200).required(),
  password: Joi.string().max(200).required(),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "confirm password is not the same as password",
    }),
}).with("password", "confirm_password");

const authLoginValidation: ObjectSchema = Joi.object({
  username: Joi.string().max(200).required(),
  password: Joi.string().max(200).required(),
});

const authLogoutValidation = Joi.string().max(200).required();

export { authRegisterValidation, authLoginValidation, authLogoutValidation };
