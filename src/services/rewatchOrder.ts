/**
 * Every movie needed before the target, each exactly once,
 * ordered so that a movie always comes after its own prerequisites.
 * The target itself is not included.
 *
 * targetId  the movie the user wants to watch
 * graph     every movie id mapped to its prerequisite ids
 */
export function getRewatchOrder(targetId: string, graph: Map<string, string[]>): string[] {
  const order: string[] = [];
  const visited = new Set<string>();

  // Depth first search. A movie is added to the list only after
  // all of its own prerequisites have been added.
  function visit(movieId: string): void {
    const prerequisites = graph.get(movieId) ?? [];

    for (const prerequisite of prerequisites) {
      if (visited.has(prerequisite)) {
        continue;
      }
      visited.add(prerequisite);

      visit(prerequisite);
      order.push(prerequisite);
    }
  }

  visit(targetId);
  return order;
}