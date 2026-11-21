
import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes";
import cinemaRoutes from "./routes/cinemaRoutes";
import { notFound, errorHandler } from "./middlewares/errorHandler";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://doomsday-ready-client-ten.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/movies", movieRoutes);
app.use("/api/cinemas", cinemaRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
