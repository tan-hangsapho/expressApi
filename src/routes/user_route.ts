import { index } from "../controllers/user_controller";
import express from "express";

export const userRouter = express.Router();

userRouter.get("/", index);
