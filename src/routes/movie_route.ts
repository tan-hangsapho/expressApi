import express, { NextFunction, Request } from "express";
import { validate } from "../middlewars/validation";
import { userSchema } from "../validations/validateSchema";
import { MovieController } from "../controllers/movies_controller";
import { StatusCode } from "../utils/consts";

export const movieRouter = express.Router();

movieRouter.post(
  "/create",
  validate(userSchema),
  async (req: Request, res, _next) => {
    try {
      const controllers = new MovieController();
      const requestBody = req.body;
      const response = await controllers.createMovie(requestBody);
      return res
        .status(StatusCode.Created)
        .send({ message: "Create Success", data: response });
    } catch (err) {
      _next(err);
    }
  }
);
movieRouter.get("/getmovie", async (req, res, next: NextFunction) => {
  try {
    const controllers = new MovieController();

    const movies = await controllers.getAllMovies();
    res.status(StatusCode.OK).json({ message: "Get Success", data: movies });
  } catch (err) {
    next(err);
  }
});
movieRouter.get("/:id", async (req, res, next: NextFunction) => {
  try {
    const controllers = new MovieController();
    const id = req.params.id;
    const movies = await controllers.getById(id);
    res.status(StatusCode.Found).json({ message: "Get Success", data: movies });
  } catch (err) {
    next(err);
  }
});
movieRouter.put("/:id", async (req, res, next: NextFunction) => {
  try {
    const controllers = new MovieController();
    const id = req.params.id;
    const requestBody = req.body;
    const movies = await controllers.updateMovie(id, requestBody); // Pass both id and requestBody
    res.status(StatusCode.OK).json({ message: "Update Successfully", movies });
  } catch (err) {
    next(err);
  }
});
movieRouter.delete("/:id", async (req, res, next: NextFunction) => {
  try {
    const { id } = req.params;
    const controllers = new MovieController();
    const response = await controllers.deleteMovie(id);
    res
      .status(StatusCode.OK)
      .json({ message: "Delete success", data: response });
  } catch (err) {
    console.error("Error deleting movie with ID:", req.params.id, err);
    next(err);
  }
});
