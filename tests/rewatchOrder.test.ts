import { describe, expect, test } from "vitest";
import { getRewatchOrder } from "../src/services/rewatchOrder";

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

// True when every movie in the list comes after all of its own prerequisites
function isValidOrder(order: string[], g: Map<string, string[]>): boolean {
  return order.every((movie, index) =>
    (g.get(movie) ?? []).every((pre) => order.indexOf(pre) !== -1 && order.indexOf(pre) < index)
  );
}

describe("getRewatchOrder", () => {
  test("Doomsday: all 7 other movies, each after its prerequisites", () => {
    const order = getRewatchOrder("doomsday", graph);

    expect([...order].sort()).toEqual(
      ["avengers", "civilWar", "endgame", "firstAvenger", "infinityWar", "ironMan", "ragnarok"].sort()
    );
    expect(isValidOrder(order, graph)).toBe(true);
  });

  test("Civil War: Iron Man and First Avenger in either order, then The Avengers", () => {
    const order = getRewatchOrder("civilWar", graph);

    expect(order).toHaveLength(3);
    expect(order[2]).toBe("avengers");
    expect([order[0], order[1]].sort()).toEqual(["firstAvenger", "ironMan"]);
  });

  test("Ragnarok: empty list", () => {
    expect(getRewatchOrder("ragnarok", graph)).toEqual([]);
  });

  test("the target itself is never in the list", () => {
    expect(getRewatchOrder("doomsday", graph)).not.toContain("doomsday");
    expect(getRewatchOrder("avengers", graph)).not.toContain("avengers");
  });

  test("a movie reached by two paths appears only once", () => {
    const diamond = new Map<string, string[]>([
      ["a", []],
      ["b", ["a"]],
      ["c", ["a"]],
      ["d", ["b", "c"]],
    ]);
    const order = getRewatchOrder("d", diamond);

    expect(order).toHaveLength(3);
    expect(new Set(order).size).toBe(3);
    expect(order[0]).toBe("a");
    expect(isValidOrder(order, diamond)).toBe(true);
  });

  test("movies that the target does not need are left out", () => {
    expect(getRewatchOrder("avengers", graph)).not.toContain("ragnarok");
    expect(getRewatchOrder("avengers", graph)).toHaveLength(2);
  });

  test("an unknown target gives an empty list", () => {
    expect(getRewatchOrder("missing", graph)).toEqual([]);
  });
});