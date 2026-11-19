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
  throw new Error("Not implemented");
}