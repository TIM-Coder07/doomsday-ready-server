import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Movie } from "../models/Movie";
import { Cinema } from "../models/Cinema";

// Sample data from the task. A movie must be listed after its prerequisites.
const movies = [
  { title: "Iron Man", releaseYear: 2008, runtime: 126, prerequisites: [] },
  { title: "Captain America: The First Avenger", releaseYear: 2011, runtime: 124, prerequisites: [] },
  { title: "The Avengers", releaseYear: 2012, runtime: 143, prerequisites: ["Iron Man", "Captain America: The First Avenger"] },
  { title: "Captain America: Civil War", releaseYear: 2016, runtime: 147, prerequisites: ["The Avengers"] },
  { title: "Thor: Ragnarok", releaseYear: 2017, runtime: 130, prerequisites: [] },
  { title: "Avengers: Infinity War", releaseYear: 2018, runtime: 149, prerequisites: ["Captain America: Civil War", "Thor: Ragnarok"] },
  { title: "Avengers: Endgame", releaseYear: 2019, runtime: 181, prerequisites: ["Avengers: Infinity War"] },
  // Runtime is a placeholder, the real one is not known yet
  { title: "Avengers: Doomsday", releaseYear: 2026, runtime: 150, prerequisites: ["Avengers: Endgame"] },
];

const cinemas = [
  { name: "Star Cineplex", bundleSizes: [1, 3, 4] },
  { name: "Blockbuster Cinemas", bundleSizes: [2, 5] },
  { name: "Silver Screen", bundleSizes: [6, 9, 20] },
  { name: "Lion Cinemas", bundleSizes: [4, 6] },
];

async function seed(): Promise<void> {
  await connectDB();

  // Build the unique indexes before inserting
  await Movie.init();
  await Cinema.init();

  await Movie.deleteMany({});
  await Cinema.deleteMany({});

  // Insert movies one by one so each prerequisite title can be turned into an id
  const idByTitle = new Map<string, string>();
  for (const movie of movies) {
    const prerequisites = movie.prerequisites.map((title) => {
      const id = idByTitle.get(title);
      if (!id) {
        throw new Error(`"${movie.title}" needs "${title}", which is not created yet`);
      }
      return id;
    });

    const created = await Movie.create({ ...movie, prerequisites });
    idByTitle.set(movie.title, String(created._id));
  }

  await Cinema.insertMany(cinemas);

  console.log(`Seeded ${movies.length} movies and ${cinemas.length} cinemas`);
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());