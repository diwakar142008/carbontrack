/**
 * @jest-environment jsdom
 */

describe("Emissions Calculations", () => {
  const { calculateEmissions, normalizeInput } = require("../js/calculator.js");

  test("transport emissions scale with distance", () => {
    const low = calculateEmissions({ carKm: 100 });
    const high = calculateEmissions({ carKm: 500 });
    expect(high.monthlyTransport).toBeGreaterThan(low.monthlyTransport);
    expect(high.monthlyTransport).toBeCloseTo(low.monthlyTransport * 5, 0);
  });

  test("electricity emissions are proportional", () => {
    const low = calculateEmissions({ electricity: 100 });
    const high = calculateEmissions({ electricity: 400 });
    expect(high.monthlyEnergy).toBeGreaterThan(low.monthlyEnergy * 3);
    expect(high.monthlyEnergy).toBeLessThan(low.monthlyEnergy * 5);
  });

  test("food emissions include meat and vegan", () => {
    const meatOnly = calculateEmissions({ food: 20 });
    const veganOnly = calculateEmissions({ vegan: 20 });
    expect(meatOnly.monthlyFood).toBeGreaterThan(veganOnly.monthlyFood);
  });

  test("waste emissions scale with amount", () => {
    const low = calculateEmissions({ waste: 10 });
    const high = calculateEmissions({ waste: 100 });
    expect(high.monthlyWaste).toBeCloseTo(low.monthlyWaste * 10, 0);
  });

  test("water emissions are calculated", () => {
    const results = calculateEmissions({ water: 1000 });
    expect(results.monthlyWater).toBeGreaterThan(0);
  });

  test("annual total is 12x monthly", () => {
    const results = calculateEmissions({
      carKm: 300,
      electricity: 200,
      food: 15,
      waste: 30,
    });
    expect(results.annualTotal).toBeGreaterThan(results.monthlyTotal * 10);
    expect(results.annualTotal).toBeLessThan(results.monthlyTotal * 14);
  });

  test("breakdown percentages sum to ~100", () => {
    const results = calculateEmissions({
      carKm: 300,
      electricity: 200,
      food: 15,
      waste: 30,
      water: 1000,
    });
    const breakdownSum =
      results.breakdown.transport +
      results.breakdown.energy +
      results.breakdown.food +
      results.breakdown.waste +
      results.breakdown.water;
    expect(breakdownSum).toBeGreaterThan(90);
    expect(breakdownSum).toBeLessThan(110);
  });

  test("potential savings are positive when actions taken", () => {
    const results = calculateEmissions({
      carKm: 500,
      electricity: 400,
      food: 20,
      waste: 50,
    });
    expect(results.potentialSavings.total).toBeGreaterThan(0);
    expect(results.potentialSavings.treesNeeded).toBeGreaterThan(0);
  });

  test("input with extreme values doesn't crash", () => {
    const results = calculateEmissions({
      carKm: 10000,
      electricity: 10000,
      food: 1000,
      waste: 1000,
      water: 100000,
    });
    expect(results.monthlyTotal).toBeGreaterThan(0);
    expect(typeof results.isAboveAverage).toBe("boolean");
  });

  test("comparison percent reflects relative to global average", () => {
    const low = calculateEmissions({
      carKm: 100,
      electricity: 50,
      food: 5,
      waste: 10,
    });
    const high = calculateEmissions({
      carKm: 1000,
      electricity: 800,
      food: 50,
      waste: 100,
    });
    expect(high.comparisonPercent).toBeGreaterThan(low.comparisonPercent);
  });
});

describe("Data Normalization", () => {
  const { normalizeInput } = require("../js/calculator.js");

  test("handles null values", () => {
    const result = normalizeInput({ carKm: null, electricity: undefined });
    expect(result.carKm).toBe(0);
    expect(result.electricity).toBe(0);
  });

  test("handles string inputs", () => {
    const result = normalizeInput({ carKm: "200", electricity: "300" });
    expect(result.carKm).toBe(200);
    expect(result.electricity).toBe(300);
  });

  test("handles decimal inputs", () => {
    const result = normalizeInput({ carKm: 100.5, electricity: 200.7 });
    expect(result.carKm).toBe(100.5);
    expect(result.electricity).toBeCloseTo(200.7, 1);
  });

  test("normalizes alternative field names", () => {
    const result = normalizeInput({ transport: 150 });
    expect(result.carKm).toBe(150);
  });
});
