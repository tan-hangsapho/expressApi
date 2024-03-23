import { NextFunction, Request, Response } from "express";
import { ErrorStateCode } from "../utils/errorState";
import { Movie } from "../database/models/movie";
import { MovieService } from "../service/movieService";

export const movieController = {
  getById: async function (req: Request, res: Response, _next: NextFunction) {
    const movieService = new MovieService();

    console.log("Incoming getById request with movieId:", req.params.movieId);
    try {
      const { movieId } = req.params;
      const movies = await movieService.getById(movieId);
      if (!movies) {
        const ErrorStatus = new ErrorStateCode("Not found", 404);
        _next(ErrorStatus);
      }
      res.status(200).json({
        data: movies,
      });
    } catch {
      const ErrorStatus = new ErrorStateCode("Sever Error", 500);
      _next(ErrorStatus);
    }
  },
  getAll: async function (req: Request, res: Response, _next: NextFunction) {
    const movieService = new MovieService();
    try {
      const movies = await movieService.getAll();
      res.json({
        status: "success",
        message: "Movie list found!!!",
        data: movies,
      });
    } catch {
      const ErrorStatus = new ErrorStateCode("Failed to open user list", 500);
      console.log(ErrorStatus.statusCode);
      _next(ErrorStatus);
    }
  },
  updateById: async function (
    req: Request,
    res: Response,
    _next: NextFunction
  ) {
    const movieService = new MovieService();
    const { name, released_on } = req.body;
    try {
      const updatedMovie = await movieService.updateById(req.params.id, {
        name,
        released_on,
      });
      res.json({
        status: "success",
        message: "Movie updated successfully!!!",
        data: updatedMovie,
      });
    } catch (error: any) {
      _next(new Error("Internal Server Error"));
    }
  },
  deleteById: async function (req: Request, res: Response) {
    const movieService = new MovieService();
    try {
      await movieService.deleteById(req.params.movieId);
      res.json({
        status: "success",
        message: "Movie delete successfully!!!",
        data: 0,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: "An error occurred while saving the movie" });
    }
  },
  create: async function (req: Request, res: Response, _next: NextFunction) {
    //console.log(req.body); // Use this for debugging
    const movieService = new MovieService();
    try {
      const createdMovie = await movieService.create({
        movieId: req.body.id,
        movieName: req.body.movieName,
        userName: req.body.userName,
        released_on: req.body.released_on,
      } as Movie);

      res.json({
        status: "success",
        message: "Movie created successfully!!!",
        data: createdMovie,
      });
    } catch (error: any) {
      _next(new Error("Internal Server Error"));
    }
  },
};
