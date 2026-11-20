import { Router } from "express";
import { createCinema, getCinemaBooking, getCinemas } from "../controllers/cinemaController";

const router = Router();

router.post("/", createCinema);
router.get("/", getCinemas);
router.get("/:id/booking", getCinemaBooking);

export default router;