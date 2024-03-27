import { Movie } from "../database/models/movie";
import { MovieRepository } from "../database/repository/movieRepo";

export class MovieService {
  repo: MovieRepository;

  constructor() {
    this.repo = new MovieRepository();
  }
  async getById(movieId: string) {
    return this.repo.findById(movieId);
  }
  async getAll() {
    return await this.repo.find();
  }
  async create(movie: Movie) {
    return await this.repo.create(movie);
  }
  async updateById(movieId: string, updateData: object) {
    return await this.repo.updateById(movieId, updateData);
  }
  async deleteById(movieId: string) {
    return await this.repo.deleteById(movieId);
  }
}
