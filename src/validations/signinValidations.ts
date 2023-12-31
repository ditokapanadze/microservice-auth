import { body } from "express-validator";

export const signinValidation = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").trim().notEmpty().withMessage("You must provide password"),
];
