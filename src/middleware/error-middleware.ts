import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import logger from "../application/logger";
import ResponseError from "../error/response-error";
import ValidationError from "../error/validation-error";

const errorMiddleware = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    res.status(err.status).json({
      code: err.status,
      message: "Response error",
      errors: err.message,
    });
  } else if (err instanceof ValidationError) {
    res.status(400).json({
      code: 400,
      message: "Validation error",
      errors: err.errors.details,
    });
  } else {
    logger.error(err.toString());
    res.status(500).json({
      code: 500,
      errors: "Internal server error",
    });
  }
};

export default errorMiddleware;
