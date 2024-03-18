import { movieModel } from "../models/movie";
import { NextFunction, Request, Response } from "express";
import { ErrorStateCode } from "../utils/errorState";

export const movieController = {
  getById: async function (req: Request, res: Response, _next: NextFunction) {
    console.log("Incoming getById request with movieId:", req.params.movieId);
    try {
      const { movieId } = req.params;
      const movies = await movieModel.findById(movieId);
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
    try {
      const movies = await movieModel.find({});
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

    try {
      const m = await new movieModel({
        movieId: req.body.id,
        movieName: req.body.movieName,
        userName: req.body.userName,
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
