import { Response, NextFunction, Request } from "express";
import { body } from "express-validator";
import Jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
export const currentUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session || !req.session.jwt) {
    return next();
  }

  try {
    const payload: any = Jwt.verify(
      req.session.jwt,
      process.env.JWT_SECRET!,
    ) as UserPayload;

    req.currentUser = payload;
  } catch (err) {
    console.log(err);
  }
  next();
};
