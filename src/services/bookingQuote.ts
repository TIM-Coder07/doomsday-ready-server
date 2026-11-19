export type BookingQuote = {
  possible: boolean;
  totalBundles: number;
  bundles: { size: number; count: number }[];
};

/**
 * Fewest bundles whose seats add up to exactly groupSize.
 * bundles are sorted from the largest size to the smallest.
 * If no exact combination exists: { possible: false, totalBundles: 0, bundles: [] }
 */
export function getBookingQuote(bundleSizes: number[], groupSize: number): BookingQuote {
  // fewest[s] = the fewest bundles that seat exactly s people (Infinity = not possible)
  const fewest = new Array<number>(groupSize + 1).fill(Infinity);
  // lastBundle[s] = the bundle size added last to reach s, used to rebuild the answer
  const lastBundle = new Array<number>(groupSize + 1).fill(0);

  // 0 people need 0 bundles
  fewest[0] = 0;

  // Dynamic programming: solve every group size from 1 up to groupSize
  for (let seats = 1; seats <= groupSize; seats++) {
    for (const size of bundleSizes) {
      if (size > seats) {
        continue;
      }

      // Take the best answer for (seats - size) and add one bundle of this size
      const candidate = fewest[seats - size] + 1;
      if (candidate < fewest[seats]) {
        fewest[seats] = candidate;
        lastBundle[seats] = size;
      }
    }
  }

  if (fewest[groupSize] === Infinity) {
    return { possible: false, totalBundles: 0, bundles: [] };
  }

  // Walk back from groupSize to 0, counting how many of each size were used
  const counts = new Map<number, number>();
  let remaining = groupSize;
  while (remaining > 0) {
    const size = lastBundle[remaining];
    counts.set(size, (counts.get(size) ?? 0) + 1);
    remaining -= size;
  }

  const bundles = [...counts.entries()]
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => b.size - a.size);

  return { possible: true, totalBundles: fewest[groupSize], bundles };
}