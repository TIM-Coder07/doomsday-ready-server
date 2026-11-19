import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "must be a valid movie id");

const movieFields = {
  title: z.string().trim().min(1, "title is required"),
  releaseYear: z.number().int().min(1900).max(2100),
  runtime: z.number().int().min(1).max(300),
  prerequisites: z.array(objectId),
  watched: z.boolean(),
};

// POST /movies: title, releaseYear and runtime are required
export const createMovieSchema = z.object({
  title: movieFields.title,
  releaseYear: movieFields.releaseYear,
  runtime: movieFields.runtime,
  prerequisites: movieFields.prerequisites.optional(),
  watched: movieFields.watched.optional(),
});

// PATCH /movies/:id: every field is optional, but at least one must be sent
export const updateMovieSchema = z
  .object(movieFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: "send at least one field to update" });