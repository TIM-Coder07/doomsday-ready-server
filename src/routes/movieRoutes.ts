import { Router } from "express";
import { createMovie, getMovieRewatchOrder, getMovies, updateMovie } from "../controllers/movieController";

const router = Router();

router.post("/", createMovie);
router.get("/", getMovies);
router.patch("/:id", updateMovie);
router.get("/:id/rewatch-order", getMovieRewatchOrder);

export default router;