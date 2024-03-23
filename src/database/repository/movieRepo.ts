import mongoose from "mongoose";
import { Movie, movieModel } from "../models/movie";

class MovieRepository {
  async findById(movieId: string) {
    return await movieModel.findById(movieId);
  }
  async find(filter?: any) {
    // An optional filter for flexibility
    return await movieModel.find(filter);
  }
  async create(movie: Movie) {
    const newMovie = new movieModel(movie);
    return await newMovie.save();
  }
  async updateById(movieId: string, updateData: object) {
    return await movieModel.findByIdAndUpdate(movieId, updateData, {
      new: true,
    }); // {new: true} returns the updated document
  }
  async deleteById(movieId: string) {
    const objectId = new mongoose.Types.ObjectId(movieId);
    return await movieModel.findByIdAndDelete({ _id: objectId });
  }
}

export { MovieRepository };
