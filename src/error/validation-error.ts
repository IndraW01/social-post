import { ValidationError as ValidationErrorJoi } from "joi";

class ValidationError extends Error {
  public errors: ValidationErrorJoi;

  constructor(message: string, errors: ValidationErrorJoi) {
    super(message);
    this.errors = errors;
  }
}

export default ValidationError;
