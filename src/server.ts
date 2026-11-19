import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";

const PORT = Number(process.env.PORT) || 5000;

async function start(): Promise<void> {
  try {
    await connectDB();

    app.listen(PORT, (error?: Error) => {
      if (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
      }
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();