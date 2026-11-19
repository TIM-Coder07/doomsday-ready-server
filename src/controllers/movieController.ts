import { Request, Response } from "express";
import { Movie } from "../models/Movie";
import { AppError } from "../utils/AppError";
import { createMovieSchema, updateMovieSchema } from "../validators/movieSchema";

// Removes repeated ids and makes sure every prerequisite is a real movie
async function checkPrerequisites(ids: string[]): Promise<string[]> {
  const uniqueIds = [...new Set(ids)];
  const found = await Movie.countDocuments({ _id: { $in: uniqueIds } });

  if (found !== uniqueIds.length) {
    throw new AppError(400, "VALIDATION_ERROR", "One or more prerequisites do not exist");
  }
  return uniqueIds;
}

// POST /api/movies
export async function createMovie(req: Request, res: Response) {
  const data = createMovieSchema.parse(req.body);
  const prerequisites = await checkPrerequisites(data.prerequisites ?? []);

  // TODO (next step): reject with 409 CIRCULAR_DEPENDENCY if this would create a cycle

  const movie = await Movie.create({ ...data, prerequisites });
  res.status(201).json(movie);
}

// GET /api/movies
export async function getMovies(_req: Request, res: Response) {
  const movies = await Movie.find().sort({ createdAt: 1 });
  res.json(movies);
}

// PATCH /api/movies/:id
export async function updateMovie(req: Request, res: Response) {
  const data = updateMovieSchema.parse(req.body);

  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    throw new AppError(404, "NOT_FOUND", "Movie not found");
  }

  if (data.prerequisites) {
    data.prerequisites = await checkPrerequisites(data.prerequisites);

    // TODO (next step): reject with 409 CIRCULAR_DEPENDENCY if this would create a cycle
  }

  movie.set(data);
  await movie.save();
  res.json(movie);
}