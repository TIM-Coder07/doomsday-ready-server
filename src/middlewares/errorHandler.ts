import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

function send(res: Response, statusCode: number, code: string, message: string) {
  res.status(statusCode).json({ error: { code, message } });
}

// Runs when no route matched the request
export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, "NOT_FOUND", `Route ${req.method} ${req.originalUrl} not found`));
}

// Every error in the app ends up here
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Errors we throw on purpose
  if (err instanceof AppError) {
    return send(res, err.statusCode, err.code, err.message);
  }

  // Request body failed a Zod schema
  if (err instanceof ZodError) {
    const message = err.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; ");
    return send(res, 400, "VALIDATION_ERROR", message);
  }

  // Data failed the Mongoose schema rules
  if (err instanceof mongoose.Error.ValidationError) {
    const message = Object.values(err.errors).map((e) => e.message).join("; ");
    return send(res, 400, "VALIDATION_ERROR", message);
  }

  // An id in the URL or body is not a valid MongoDB id
  if (err instanceof mongoose.Error.CastError) {
    return send(res, 400, "VALIDATION_ERROR", `Invalid ${err.path}: ${String(err.value)}`);
  }

  if (typeof err === "object" && err !== null) {
    const e = err as { code?: number; keyPattern?: Record<string, unknown>; type?: string };

    // Unique index broken: same title or name already exists
    if (e.code === 11000) {
      const field = Object.keys(e.keyPattern ?? {})[0] ?? "field";
      return send(res, 409, `DUPLICATE_${field.toUpperCase()}`, `This ${field} already exists`);
    }

    // Request body is not valid JSON
    if (e.type === "entity.parse.failed") {
      return send(res, 400, "VALIDATION_ERROR", "Request body is not valid JSON");
    }
  }

  console.error(err);
  return send(res, 500, "INTERNAL_ERROR", "Something went wrong");
}