import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Movie, movieModel } from "../models/movie";
import { MovieRepository } from "../repository/movieRepo";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
describe("MovieRepository", () => {
  let repository: MovieRepository;

  beforeEach(async () => {
    repository = new MovieRepository();
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  });

  describe("create movie", () => {
    it("should create a new movie", async () => {
      const newMovieData = {
        movieId: "movie 1",
        movieName: "Test Movie 1",
        userName: "Test User 1",
        released_on: new Date("3-21-2024"),
      } as Movie;
      const newMovie = await repository.create(newMovieData);
      expect(newMovie).toBeDefined();
      expect(newMovie.movieName).toEqual(newMovieData.movieName);
      expect(newMovie.userName).toEqual(newMovieData.userName);
    });
    it("should return all user", async () => {
      const newMovieData1 = {
        movieId: "movie 1",
        movieName: "Test Movie 1",
        userName: "Test User 1",
        released_on: new Date("3-21-2024"),
      } as Movie;
      const newMovieData2 = {
        movieId: "movie 2",
        movieName: "Test Movie 2",
        userName: "Test User 2",
        released_on: new Date("3-21-2024"),
      } as Movie;
      await repository.create(newMovieData1);
      await repository.create(newMovieData2);
      const allMovies = await repository.find();
      expect(allMovies.length).toBe(2);
    });
    it("get movie by id should return movie ID", async () => {
      const MovieData = {
        movieId: "movie 1",
        movieName: "Test Movie",
        userName: "Test User ",
        released_on: new Date("3-21-2024"),
      } as Movie;
      jest.spyOn(movieModel, "findById").mockResolvedValue(MovieData);
      const result = await repository.findById(MovieData.movieId);
      expect(movieModel.findById).toHaveBeenCalledWith(MovieData.movieId);
      expect(result).toEqual(MovieData);
    });
    it("should update a movie and return the updated document", async () => {
      // 1. Create a test movie
      const existingMovieData = {
        movieId: "movie 1",
        movieName: "Test Movie",
        userName: "Test User ",
        released_on: new Date("3-21-2024"),
      } as Movie;
      const createdMovie = await repository.create(existingMovieData);

      // Ensure createdMovie is not null or undefined
      if (!createdMovie) {
        throw new Error("Failed to create movie");
      }

      const updateData = {
        movieName: "Updated Movie Name",
      };

      // 3.  Call  updateById
      const updatedMovie = await repository.updateById(
        createdMovie.id,
        updateData
      );

      expect(updatedMovie).toBeDefined();
      expect(updatedMovie?.movieName).toEqual(updateData.movieName);
    });
    it("should delete a movie from the database", async () => {
      // 1. Create a Test Movie
      const movieData1 = {
        movieId: "63f267979cdcc5bc31743406",
        movieName: "Test Movie",
        userName: "Test User",
        released_on: new Date("3-21-2024"),
      } as Movie;
      const createdMovie = await repository.create(movieData1);

      // 2. Delete the movie
      await repository.deleteById(createdMovie.movieId ?? "default-id");

      // 3. Try to find the deleted movie
      const deletedMovie = await movieModel.findOne({
        movieId: createdMovie.movieId,
      });

      // 4. Ensure that the deleted movie does not exist
      expect(deletedMovie).toBeNull();
    });
  });
});
