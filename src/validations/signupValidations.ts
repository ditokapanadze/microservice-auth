import { body } from "express-validator";

export const signupValidations = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("password must be between 4 and 20 characters"),
];
