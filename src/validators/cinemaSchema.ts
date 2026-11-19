import { z } from "zod";

export const createCinemaSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  bundleSizes: z
    .array(z.number().int().min(1).max(500))
    .min(1, "send at least 1 bundle size")
    .max(10, "send at most 10 bundle sizes")
    .refine((sizes) => new Set(sizes).size === sizes.length, { message: "bundle sizes must be different" }),
});