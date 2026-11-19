/**
 * Would saving these prerequisites make a movie depend on itself?
 *
 * movieId             the movie being saved, or null for a movie that does not exist yet
 * newPrerequisiteIds  the prerequisites it would have after saving
 * graph               every existing movie id mapped to its current prerequisite ids
 *
 * Returns true if the change would create a cycle.
 */
export function wouldCreateCycle(
  movieId: string | null,
  newPrerequisiteIds: string[],
  graph: Map<string, string[]>
): boolean {
  // A new movie is not a prerequisite of anything yet, so no path can lead back to it
  if (movieId === null) {
    return false;
  }

  const visited = new Set<string>();
  const toVisit = [...newPrerequisiteIds];

  // Depth first search: walk backwards through prerequisites
  while (toVisit.length > 0) {
    const current = toVisit.pop() as string;

    // We came back to the movie we started from: cycle
    if (current === movieId) {
      return true;
    }

    if (visited.has(current)) {
      continue;
    }
    visited.add(current);

    const prerequisites = graph.get(current) ?? [];
    toVisit.push(...prerequisites);
  }

  return false;
}