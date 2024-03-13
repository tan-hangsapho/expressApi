import { index, ejs } from "../controllers/student_controller";
import express from "express";

export const studentRouter = express.Router();

studentRouter.get("/", index);
studentRouter.get("/ejs", ejs);
