import mongoose from "mongoose";
export interface Movie extends Document {
  movieId: string;
  name: string;
  released_on: Date;
}
//Schema is something body of the database
const MovieSchema = new mongoose.Schema({
  movieId: { type: String },
  name: { type: String, trim: true, required: true },
  released_on: { type: Date, trim: true, default: Date.now, required: true },
});
export const movieModel = mongoose.model("Movie", MovieSchema);
