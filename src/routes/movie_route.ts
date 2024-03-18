import express from "express";
import { validateMongooseId } from "../middlewars/mongoose";
import { movieController } from "../controllers/movies_controller";
import { validate } from "../middlewars/validation";
import { userSchema } from "../validations/validateSchema";

export const movieRouter = express.Router();
// get all users
movieRouter.get("/", movieController.getAll);
//create user
movieRouter.post("/", validate(userSchema), movieController.create);
//get one user
movieRouter.get("/:movieId", validateMongooseId, movieController.getById);
//update user
movieRouter.patch("/:movieId", validateMongooseId, movieController.deleteById);
//delete user
movieRouter.delete("/:movieId", validateMongooseId, movieController.deleteById);
