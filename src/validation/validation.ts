import { Schema } from "joi";
import ValidationError from "../error/validation-error";

const validation = (schema: Schema, request: string | object | number) => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    throw new ValidationError("Validation request error", result.error);
  }

  return result.value;
};

export default validation;
