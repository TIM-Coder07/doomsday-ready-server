import { Router } from "express";
import { createMovie, getMovies, updateMovie } from "../controllers/movieController";

const router = Router();

router.post("/", createMovie);
router.get("/", getMovies);
router.patch("/:id", updateMovie);

export default router;