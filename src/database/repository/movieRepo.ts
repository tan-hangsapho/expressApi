import mongoose from "mongoose";
import { Movie, movieModel } from "../models/movie";

class MovieRepository {
  async findById(id: string): Promise<Movie | null> {
    return movieModel.findById(id);
  }
  async find(filter?: any) {
    // An optional filter for flexibility
    return await movieModel.find(filter);
  }
  async create(movie: Movie) {
    const newMovie = new movieModel(movie);
    return await newMovie.save();
  }
  async updateById(id: string, updateData: object): Promise<Movie | null> {
    return movieModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id: string): Promise<Movie | null> {
    return movieModel.findByIdAndDelete(id);
  }
}

export { MovieRepository };
