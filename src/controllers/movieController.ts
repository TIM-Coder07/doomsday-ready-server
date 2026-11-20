import { Request, Response } from "express";
import { Movie } from "../models/Movie";
import { AppError } from "../utils/AppError";
import { createMovieSchema, updateMovieSchema } from "../validators/movieSchema";
import { getRewatchOrder } from "../services/rewatchOrder";
import { wouldCreateCycle } from "../services/cycleCheck";

// Every movie id mapped to its current prerequisite ids
async function loadGraph(): Promise<Map<string, string[]>> {
  const movies = await Movie.find({}, { prerequisites: 1 }).lean();
  return new Map(movies.map((m) => [String(m._id), (m.prerequisites ?? []).map(String)]));
}

// Throws 409 if saving these prerequisites would make the movie depend on itself
async function rejectCycle(movieId: string | null, prerequisites: string[]): Promise<void> {
  if (movieId === null || prerequisites.length === 0) {
    return;
  }
  const graph = await loadGraph();
  if (wouldCreateCycle(movieId, prerequisites, graph)) {
    throw new AppError(
      409,
      "CIRCULAR_DEPENDENCY",
      "These prerequisites would make the movie depend on itself"
    );
  }
}

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

  // A brand new movie has no id yet, so nothing can point back to it: no cycle possible
  await rejectCycle(null, prerequisites);

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
    await rejectCycle(String(movie._id), data.prerequisites);
  }

  movie.set(data);
  await movie.save();
  res.json(movie);
}

// GET /api/movies/:id/rewatch-order
export async function getMovieRewatchOrder(req: Request, res: Response) {
  const target = await Movie.findById(req.params.id);
  if (!target) {
    throw new AppError(404, "NOT_FOUND", "Movie not found");
  }

  const allMovies = await Movie.find();
  const moviesById = new Map(allMovies.map((m) => [String(m._id), m]));
  const graph = new Map(allMovies.map((m) => [String(m._id), m.prerequisites.map(String)]));

  // Ids in watch order, then turned back into full movies
  const orderedIds = getRewatchOrder(String(target._id), graph);
  const order = orderedIds.flatMap((id) => moviesById.get(id) ?? []);

  const watchedCount = order.filter((m) => m.watched).length;
  const remainingRuntime = order.filter((m) => !m.watched).reduce((sum, m) => sum + m.runtime, 0);

  res.json({
    target: { id: String(target._id), title: target.title },
    order,
    watchedCount,
    totalCount: order.length,
    remainingRuntime,
  });
}