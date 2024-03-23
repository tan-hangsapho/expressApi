import mongoose from "mongoose";
export interface Movie extends Document {
  movieId: string;
  movieName: string;
  userName: string;
  released_on: Date;
}
//Schema is something body of the database
const MovieSchema = new mongoose.Schema({
  movieId: { type: String },
  movieName: { type: String, trim: true, required: true },
  userName: { type: String, trim: true, required: true },
  released_on: { type: Date, trim: true, default: Date.now },
});
export const movieModel = mongoose.model("Movie", MovieSchema);
