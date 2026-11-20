import { Request, Response } from "express";
import { Cinema } from "../models/Cinema";
import { getBookingQuote } from "../services/bookingQuote";
import { AppError } from "../utils/AppError";
import { bookingQuerySchema, createCinemaSchema } from "../validators/cinemaSchema";

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

// GET /api/cinemas/:id/booking?groupSize=6
export async function getCinemaBooking(req: Request, res: Response) {
  const { groupSize } = bookingQuerySchema.parse(req.query);

  const cinema = await Cinema.findById(req.params.id);
  if (!cinema) {
    throw new AppError(404, "NOT_FOUND", "Cinema not found");
  }

  const quote = getBookingQuote(cinema.bundleSizes, groupSize);

  res.json({
    cinema: { id: String(cinema._id), name: cinema.name },
    groupSize,
    ...quote,
  });
}