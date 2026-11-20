import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Movie } from "../models/Movie";
import { Cinema } from "../models/Cinema";

// Sample data from the task. Runtimes are the theatrical runtimes.
// Avengers: Doomsday is not out yet, so its runtime is a placeholder.
const sampleMovies: { title: string; releaseYear: number; runtime: number; prerequisites: string[] }[] = [
  { title: "Iron Man", releaseYear: 2008, runtime: 126, prerequisites: [] },
  { title: "Captain America: The First Avenger", releaseYear: 2011, runtime: 124, prerequisites: [] },
  {
    title: "The Avengers",
    releaseYear: 2012,
    runtime: 143,
    prerequisites: ["Iron Man", "Captain America: The First Avenger"],
  },
  { title: "Captain America: Civil War", releaseYear: 2016, runtime: 147, prerequisites: ["The Avengers"] },
  { title: "Thor: Ragnarok", releaseYear: 2017, runtime: 130, prerequisites: [] },
  {
    title: "Avengers: Infinity War",
    releaseYear: 2018,
    runtime: 149,
    prerequisites: ["Captain America: Civil War", "Thor: Ragnarok"],
  },
  { title: "Avengers: Endgame", releaseYear: 2019, runtime: 181, prerequisites: ["Avengers: Infinity War"] },
  { title: "Avengers: Doomsday", releaseYear: 2026, runtime: 150, prerequisites: ["Avengers: Endgame"] },
];

// One cinema per booking example in the task
const sampleCinemas = [
  { name: "Stark Cinema", bundleSizes: [1, 3, 4] },
  { name: "Asgard Screens", bundleSizes: [2, 5] },
  { name: "Wakanda IMAX", bundleSizes: [6, 9, 20] },
  { name: "Sanctum Theatre", bundleSizes: [4, 6] },
];

async function seed(): Promise<void> {
  const reset = process.argv.includes("--reset");
  await connectDB();

  if (reset) {
    await Promise.all([Movie.deleteMany({}), Cinema.deleteMany({})]);
    console.log("Removed all movies and cinemas");
  }

  // Only fill an empty database, so running this on every start is safe
  if ((await Movie.countDocuments()) === 0) {
    const idByTitle = new Map<string, mongoose.Types.ObjectId>();

    // The list above is already in an order where prerequisites come first
    for (const { prerequisites, ...fields } of sampleMovies) {
      const prerequisiteIds = prerequisites.map((title) => {
        const id = idByTitle.get(title);
        if (!id) throw new Error(`Seed order is wrong: "${title}" must come before it is used`);
        return id;
      });
      const movie = await Movie.create({ ...fields, prerequisites: prerequisiteIds });
      idByTitle.set(fields.title, movie._id);
    }
    console.log(`Added ${sampleMovies.length} movies`);
  } else {
    console.log("Movies already exist, skipped");
  }

  if ((await Cinema.countDocuments()) === 0) {
    await Cinema.insertMany(sampleCinemas);
    console.log(`Added ${sampleCinemas.length} cinemas`);
  } else {
    console.log("Cinemas already exist, skipped");
  }
}

seed()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  });