import express from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes will be added here:
// app.use("/api/movies", movieRoutes);
// app.use("/api/cinemas", cinemaRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;