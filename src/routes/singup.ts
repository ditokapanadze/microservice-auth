import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/BadRequestError";

import { validationMiddleware } from "../middlewares/validate-request";
import { signupValidations } from "../validations/signupValidations";
require("dotenv").config();

const router = express.Router();

router.post(
  "/api/users/signup",
  validationMiddleware(signupValidations),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });

    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  },
);

export { router as singupRouter };
