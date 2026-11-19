import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes";
import cinemaRoutes from "./routes/cinemaRoutes";
import { notFound, errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/movies", movieRoutes);
app.use("/api/cinemas", cinemaRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
