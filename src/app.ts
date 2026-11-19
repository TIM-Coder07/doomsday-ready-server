import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes will be added here:
// app.use("/api/movies", movieRoutes);
// app.use("/api/cinemas", cinemaRoutes);

// The error handler will be added here, after the routes.

export default app;