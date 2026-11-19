import { Request, Response } from "express";
import { Cinema } from "../models/Cinema";
import { createCinemaSchema } from "../validators/cinemaSchema";

// POST /api/cinemas
export async function createCinema(req: Request, res: Response) {
  const data = createCinemaSchema.parse(req.body);
  const cinema = await Cinema.create(data);
  res.status(201).json(cinema);
}

// GET /api/cinemas
export async function getCinemas(_req: Request, res: Response) {
  const cinemas = await Cinema.find().sort({ createdAt: 1 });
  res.json(cinemas);
}