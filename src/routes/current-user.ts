import express from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { currentUserMiddleware } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUserMiddleware,
  requireAuth,
  (req, res) => {
    res.send({ currentUser: req.currentUser || null });
  },
);

export { router as currentUserRouter };
