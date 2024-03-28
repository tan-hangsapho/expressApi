import {
  Route,
  Post,
  Body,
  Get,
  Put,
  Path,
  Delete,
  SuccessResponse,
  Queries,
} from "tsoa";
import { Movie, Options } from "../database/models/movie";
import { MovieService } from "../service/movieService";
import { ErrorStateCode } from "../utils/errorState";
import { Types } from "mongoose";

@Route("movie")
export class MovieController {
  @Post("/create")
  public async createMovie(@Body() requestBody: Movie): Promise<any> {
    try {
      const movieService = new MovieService();
      const { movieName, userName, released_on } = requestBody;
      const newMovie = await movieService.create({
        movieName,
        userName,
        released_on,
      });
      await newMovie.save();
      return newMovie;
    } catch (err) {
      throw err;
    }
  }
  @Get("/get")
  public async getAllMovies(@Queries() options: Options): Promise<any> {
    const movieService = new MovieService();
    try {
      const movies = await movieService.getAll(options);

      return movies;
    } catch (error) {
      throw new ErrorStateCode("Failed to retrieve movie list", 500);
    }
  }
  @Get("/:id")
  public async getById(@Path() id: string): Promise<Movie> {
    try {
      const movieService = new MovieService();
      const movie = await movieService.getById(id);
      if (movie === null) {
        throw new Error("Movie not found");
      }
      return movie;
    } catch (error) {
      throw error;
    }
  }
  @Put("{id}")
  public async updateMovie(
    @Path() id: string,
    @Body() requestBody: Movie
  ): Promise<Movie> {
    try {
      const movieService = new MovieService();
      const { movieName, userName, released_on } = requestBody;
      const updatedMovie = await movieService.updateById(id, {
        movieName,
        userName,
        released_on,
      });
      if (updatedMovie === null) {
        throw new ErrorStateCode(`Movie with id ${id} not found`, 404);
      }
      return updatedMovie;
    } catch (err) {
      throw err;
    }
  }
  @Delete("/:id")
  @SuccessResponse("204", "Movie deleted") // 204 No Content is more typical for DELETE
  public async deleteMovie(@Path() id: string): Promise<Movie | null> {
    try {
      const movieService = new MovieService();
      const deletedMovie = await movieService.deleteById(id);
      return deletedMovie;
    } catch (error) {
      throw new Error("An error occurred while deleting the movie");
    }
  }
}
