import { movieModel } from "../models/movie";
import { NextFunction, Request, Response } from "express";

export const movieController = {
  getById: async function (req: Request, res: Response, _next: NextFunction) {
    console.log("Incoming getById request with movieId:", req.params.movieId);
    try {
      const { movieId } = req.params;
      const movies = await movieModel.findById(movieId);
      if (!movies) {
        throw new Error("Not Found");
      }
      res.status(200).json({
        data: movies,
      });
    } catch (error: { message: string } | any) {
      console.error("Error fetching movie:", error); // Log the error
      _next(new Error(error.message));
    }
  },
  getAll: async function (req: Request, res: Response, _next: NextFunction) {
    try {
      const movies = await movieModel.find({});
      res.json({
        status: "success",
        message: "Movie list found!!!",
        data: movies,
      });
    } catch (error: any) {
      _next(new Error("Internal Server Error"));
    }
  },
  updateById: async function (
    req: Request,
    res: Response,
    _next: NextFunction
  ) {
    try {
      const m = await movieModel.findByIdAndUpdate(req.params.movieId, {
        name: req.body.name,
      });
      res.json({
        status: "success",
        message: "Movie updated successfully!!!",
        data: m,
      });
    } catch (error: any) {
      _next(new Error("Internal Server Error"));
    }
  },
  deleteById: async function (req: Request, res: Response) {
    try {
      await movieModel.deleteOne({ _id: req.params.movieId });
      res.json({
        status: "success",
        message: "Movie updated successfully!!!",
        data: null,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: "An error occurred while saving the movie" });
    }
  },
  create: async function (req: Request, res: Response, _next: NextFunction) {
    //console.log(req.body); // Use this for debugging

    // Validate that name and released_on exist
    if (!req.body.name || !req.body.released_on) {
      return res
        .status(400)
        .json({ error: "Name and released_on are required fields" });
    }

    try {
      const m = await new movieModel({
        movieId: req.body.id,
        name: req.body.name,
        released_on: req.body.released_on,
      }).save();

      res.json({
        status: "success",
        message: "Movie created successfully!!!",
        data: m,
      });
    } catch (error: any) {
      _next(new Error("Internal Server Error"));
    }
  },
};
