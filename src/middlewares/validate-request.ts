import { Request, Response, NextFunction } from "express";

import { ValidationChain, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};

export const validationMiddleware = (validations: any) => {
  return [validations, validateRequest];
};
