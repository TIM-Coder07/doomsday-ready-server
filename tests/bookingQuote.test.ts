import { describe, expect, test } from "vitest";
import { getBookingQuote } from "../src/services/bookingQuote";

describe("getBookingQuote", () => {
  test("sizes 1, 3, 4 and group 6: 2 bundles, 3 x 2", () => {
    expect(getBookingQuote([1, 3, 4], 6)).toEqual({
      possible: true,
      totalBundles: 2,
      bundles: [{ size: 3, count: 2 }],
    });
  });

  test("sizes 2, 5 and group 11: 4 bundles, 5 x 1 and 2 x 3", () => {
    expect(getBookingQuote([2, 5], 11)).toEqual({
      possible: true,
      totalBundles: 4,
      bundles: [
        { size: 5, count: 1 },
        { size: 2, count: 3 },
      ],
    });
  });

  test("sizes 6, 9, 20 and group 44: 4 bundles, 20 x 1, 9 x 2, 6 x 1", () => {
    expect(getBookingQuote([6, 9, 20], 44)).toEqual({
      possible: true,
      totalBundles: 4,
      bundles: [
        { size: 20, count: 1 },
        { size: 9, count: 2 },
        { size: 6, count: 1 },
      ],
    });
  });

  test("sizes 4, 6 and group 7: not possible", () => {
    expect(getBookingQuote([4, 6], 7)).toEqual({
      possible: false,
      totalBundles: 0,
      bundles: [],
    });
  });

  test("group equal to one bundle size: 1 bundle", () => {
    expect(getBookingQuote([2, 5], 5)).toEqual({
      possible: true,
      totalBundles: 1,
      bundles: [{ size: 5, count: 1 }],
    });
  });

  test("group smaller than every bundle: not possible", () => {
    expect(getBookingQuote([4, 6], 3).possible).toBe(false);
  });

  test("the order of the sizes does not change the answer", () => {
    expect(getBookingQuote([20, 6, 9], 44)).toEqual(getBookingQuote([6, 9, 20], 44));
  });

  test("seats always add up to exactly the group size", () => {
    const quote = getBookingQuote([7, 13, 50], 9999);
    const seats = quote.bundles.reduce((sum, b) => sum + b.size * b.count, 0);
    const count = quote.bundles.reduce((sum, b) => sum + b.count, 0);
    expect(quote.possible).toBe(true);
    expect(seats).toBe(9999);
    expect(count).toBe(quote.totalBundles);
  });

  test("largest allowed input finishes: size 1 only, group 10000", () => {
    expect(getBookingQuote([1], 10000)).toEqual({
      possible: true,
      totalBundles: 10000,
      bundles: [{ size: 1, count: 10000 }],
    });
  });
});