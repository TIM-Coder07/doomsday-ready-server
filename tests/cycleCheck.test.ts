import { describe, expect, test } from "vitest";
import { wouldCreateCycle } from "../src/services/cycleCheck";

// Sample data from the task. Key = movie, value = movies to watch first.
const graph = new Map<string, string[]>([
  ["ironMan", []],
  ["firstAvenger", []],
  ["avengers", ["ironMan", "firstAvenger"]],
  ["civilWar", ["avengers"]],
  ["ragnarok", []],
  ["infinityWar", ["civilWar", "ragnarok"]],
  ["endgame", ["infinityWar"]],
  ["doomsday", ["endgame"]],
]);

describe("wouldCreateCycle", () => {
  test("Endgame as a prerequisite of Iron Man is a cycle", () => {
    expect(wouldCreateCycle("ironMan", ["endgame"], graph)).toBe(true);
  });

  test("a movie as its own prerequisite is a cycle", () => {
    expect(wouldCreateCycle("ironMan", ["ironMan"], graph)).toBe(true);
  });

  test("a direct two movie loop is a cycle", () => {
    expect(wouldCreateCycle("ironMan", ["avengers"], graph)).toBe(true);
  });

  test("one bad prerequisite among good ones is still a cycle", () => {
    expect(wouldCreateCycle("ironMan", ["ragnarok", "doomsday"], graph)).toBe(true);
  });

  test("a normal prerequisite is fine", () => {
    expect(wouldCreateCycle("ragnarok", ["ironMan"], graph)).toBe(false);
  });

  test("keeping the current prerequisites is fine", () => {
    expect(wouldCreateCycle("avengers", ["ironMan", "firstAvenger"], graph)).toBe(false);
  });

  test("two paths to the same movie is not a cycle", () => {
    expect(wouldCreateCycle("doomsday", ["endgame", "ironMan"], graph)).toBe(false);
  });

  test("clearing prerequisites is fine", () => {
    expect(wouldCreateCycle("endgame", [], graph)).toBe(false);
  });

  test("a new movie (no id yet) can never create a cycle", () => {
    expect(wouldCreateCycle(null, ["doomsday", "ironMan"], graph)).toBe(false);
  });
});