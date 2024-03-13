// import { v1 } from "uuid";
import { v1 } from "uuid";
import { movieModel } from "../models/movie";
import { Request, Response } from "express";

export const movieController = {
  getById: async function name(req: Request, res: Response) {
    console.log(req.body);
    const m = await movieModel.findById(req.params.movieId);
    res.json({ status: "success", message: "Movie list found!!!", data: m });
  },
  getAll: async function (req: Request, res: Response) {
    const movies = await movieModel.find({});
    res.json({
      status: "success",
      message: "Movie list found!!!",
      data: movies,
    });
  },
  updateById: async function (req: Request, res: Response) {
    const m = await movieModel.findByIdAndUpdate(req.params.movieId, {
      name: req.body.name,
    });
    res.json({
      status: "success",
      message: "Movie updated successfully!!!",
      data: m,
    });
  },
  deleteById: async function (req: Request, res: Response) {
    await movieModel.deleteOne({ _id: req.params.movieId });
    res.json({
      status: "success",
      message: "Movie updated successfully!!!",
      data: null,
    });
  },
  create: async function (req: Request, res: Response) {
    //console.log(req.body); // Use this for debugging

    const Id = "v1";

    // Validate that name and released_on exist
    if (!req.body.name || !req.body.released_on) {
      return res
        .status(400)
        .json({ error: "Name and released_on are required fields" });
    }

    try {
      const m = await new movieModel({
        movieId: Id,
        name: req.body.name,
        released_on: req.body.released_on,
      }).save();

      res.json({
        status: "success",
        message: "Movie created successfully!!!",
        data: m,
      });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
      } else {
        return res
          .status(500)
          .json({ error: "An error occurred while saving the movie" });
      }
    }
  },
};
