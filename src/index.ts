import express from "express";
import { json } from "body-parser";
require("dotenv").config();

import "express-async-errors";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { singupRouter } from "./routes/singup";
import { currentUserRouter } from "./routes/current-user";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import cookieSession from "cookie-session";
import mongoose from "mongoose";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  }),
);

app.use(currentUserRouter);
app.use(signoutRouter);
app.use(signinRouter);
app.use(singupRouter);

app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

app.get("/api/users/test", (req, res) => {
  res.send("<h1>5</h1>");
});

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv/auth");

    console.log("connected to db");
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log("Listening on post 3000!!!!!!!!!!!!!!!!!!");
  });
};
start();
