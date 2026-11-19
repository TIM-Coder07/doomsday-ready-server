import { Router } from "express";
import { createCinema, getCinemas } from "../controllers/cinemaController";

const router = Router();

router.post("/", createCinema);
router.get("/", getCinemas);

export default router;