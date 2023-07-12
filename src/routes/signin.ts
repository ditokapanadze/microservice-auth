import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { validationMiddleware } from "../middlewares/validate-request";
import { signinValidation } from "../validations/signinValidations";
import { User } from "../models/user";
import Jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/BadRequestError";
import { PasswordHelper } from "../helpers/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  validationMiddleware(signinValidation),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Wrong credentials");
    }

    const checkPass = await PasswordHelper.compare(
      existingUser.password,
      password,
    );

    if (!checkPass) {
      throw new BadRequestError("Invalid Credentials");
    }

    const userJwt = Jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET as string,
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  },
);

export { router as signinRouter };
