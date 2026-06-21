/**
 * @jest-environment jsdom
 */

const CarbonCalculator = require("../js/calculator.js");

describe("CarbonCalculator", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("normalizeInput", () => {
    test("converts valid string numbers to positive numbers", () => {
      const result = CarbonCalculator.normalizeInput({
        carKm: "100",
        electricity: "200",
        meat: "10",
      });
      expect(result.carKm).toBe(100);
      expect(result.electricity).toBe(200);
      expect(result.meat).toBe(10);
    });

    test("converts valid numeric values", () => {
      const result = CarbonCalculator.normalizeInput({
        carKm: 50,
        electricity: 150,
      });
      expect(result.carKm).toBe(50);
      expect(result.electricity).toBe(150);
    });

    test("returns 0 for negative values", () => {
      const result = CarbonCalculator.normalizeInput({
        carKm: -10,
        electricity: -5,
      });
      expect(result.carKm).toBe(0);
      expect(result.electricity).toBe(0);
    });

    test("returns 0 for non-numeric values", () => {
      const result = CarbonCalculator.normalizeInput({
        carKm: "abc",
        electricity: null,
      });
      expect(result.carKm).toBe(0);
      expect(result.electricity).toBe(0);
    });

    test("returns 0 for zero values", () => {
      const result = CarbonCalculator.normalizeInput({
        carKm: 0,
        electricity: 0,
      });
      expect(result.carKm).toBe(0);
      expect(result.electricity).toBe(0);
    });

    test("handles empty input object", () => {
      const result = CarbonCalculator.normalizeInput({});
      expect(result.carKm).toBe(0);
      expect(result.electricity).toBe(0);
      expect(result.meat).toBe(0);
    });
  });

  describe("calculateEmissions", () => {
    test("calculates monthly transport emissions correctly", () => {
      const results = CarbonCalculator.calculateEmissions({
        carKm: 500,
        publicTransport: 100,
        flights: 2,
      });
      expect(results.monthlyTransport).toBeGreaterThan(0);
      expect(results.annualTransport).toBeGreaterThan(0);
    });

    test("calculates monthly energy emissions correctly", () => {
      const results = CarbonCalculator.calculateEmissions({
        electricity: 300,
        gas: 50,
      });
      expect(results.monthlyEnergy).toBeGreaterThan(0);
    });

    test("calculates monthly food emissions correctly", () => {
      const results = CarbonCalculator.calculateEmissions({
        food: 20,
        vegan: 5,
      });
      expect(results.monthlyFood).toBeGreaterThan(0);
    });

    test("calculates monthly total as sum of categories", () => {
      const results = CarbonCalculator.calculateEmissions({
        carKm: 200,
        electricity: 100,
        food: 10,
        waste: 20,
      });
      expect(results.monthlyTotal).toBeGreaterThan(0);
      expect(results.monthlyTransport).toBeGreaterThan(0);
      expect(results.monthlyEnergy).toBeGreaterThan(0);
      expect(results.monthlyFood).toBeGreaterThan(0);
      expect(results.monthlyWaste).toBeGreaterThan(0);
    });

    test("calculates annual total from monthly", () => {
      const results = CarbonCalculator.calculateEmissions({
        carKm: 500,
        electricity: 400,
        food: 20,
        waste: 50,
      });
      expect(results.annualTotal).toBeGreaterThan(0);
      expect(results.annualTotal).toBeGreaterThan(results.monthlyTotal);
    });

    test("calculates breakdown percentages", () => {
      const results = CarbonCalculator.calculateEmissions({
        carKm: 300,
        electricity: 200,
        food: 10,
        waste: 30,
      });
      const total = results.monthlyTotal;
      expect(
        results.breakdown.transport +
          results.breakdown.energy +
          results.breakdown.food +
          results.breakdown.waste,
      ).toBeCloseTo(100, 0);
    });

    test("identifies above average footprint", () => {
      const results = CarbonCalculator.calculateEmissions({
        carKm: 1000,
        electricity: 800,
        food: 50,
        waste: 100,
      });
      expect(typeof results.isAboveAverage).toBe("boolean");
    });

    test("returns comparison percent", () => {
      const results = CarbonCalculator.calculateEmissions({
        carKm: 100,
        electricity: 50,
        food: 5,
        waste: 10,
      });
      expect(typeof results.comparisonPercent).toBe("number");
    });

    test("returns global average", () => {
      const results = CarbonCalculator.calculateEmissions({});
      expect(results.globalAverage).toBeGreaterThan(0);
    });

    test("handles all zeros", () => {
      const results = CarbonCalculator.calculateEmissions({});
      expect(results.monthlyTotal).toBe(0);
      expect(results.annualTotal).toBe(0);
    });
  });

  describe("generateRecommendations", () => {
    test("returns an array of recommendations", () => {
      const results = CarbonCalculator.calculateEmissions({
        carKm: 500,
        electricity: 400,
        food: 20,
        waste: 50,
      });
      const recommendations = CarbonCalculator.generateRecommendations(results);
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    test("recommendations have required fields", () => {
      const results = CarbonCalculator.calculateEmissions({
        carKm: 500,
        electricity: 400,
        food: 20,
        waste: 50,
      });
      const recommendations = CarbonCalculator.generateRecommendations(results);
      recommendations.forEach((rec) => {
        expect(rec).toHaveProperty("title");
        expect(rec).toHaveProperty("description");
        expect(rec).toHaveProperty("icon");
        expect(rec).toHaveProperty("savings");
        expect(rec).toHaveProperty("priority");
      });
    });

    test("recommendations are sorted by priority", () => {
      const results = CarbonCalculator.calculateEmissions({
        carKm: 1000,
        electricity: 800,
        food: 50,
        waste: 100,
      });
      const recommendations = CarbonCalculator.generateRecommendations(results);
      const priorities = recommendations.map((r) => r.priority);
      const sortedPriorities = [...priorities].sort((a, b) => {
        const order = ["high", "medium", "low"];
        return order.indexOf(a) - order.indexOf(b);
      });
      expect(priorities).toEqual(sortedPriorities);
    });

    test("returns max 5 recommendations", () => {
      const results = CarbonCalculator.calculateEmissions({
        carKm: 1000,
        electricity: 800,
        food: 50,
        waste: 100,
        water: 5000,
      });
      const recommendations = CarbonCalculator.generateRecommendations(results);
      expect(recommendations.length).toBeLessThanOrEqual(5);
    });
  });

  describe("calculateEmissions - water input", () => {
    test("calculates water emissions", () => {
      const results = CarbonCalculator.calculateEmissions({
        carKm: 100,
        electricity: 100,
        food: 5,
        waste: 10,
        water: 3000,
      });
      expect(results.monthlyWater).toBeGreaterThan(0);
      expect(results.annualWater).toBeGreaterThan(0);
    });

    test("includes water in breakdown", () => {
      const results = CarbonCalculator.calculateEmissions({
        carKm: 100,
        electricity: 100,
        food: 5,
        waste: 10,
        water: 3000,
      });
      expect(results.breakdown.water).toBeGreaterThanOrEqual(0);
    });
  });

  describe("EMISSION_FACTORS", () => {
    test("has all required emission factors", () => {
      const factors = CarbonCalculator.EMISSION_FACTORS;
      expect(factors).toHaveProperty("car");
      expect(factors).toHaveProperty("publicTransport");
      expect(factors).toHaveProperty("flights");
      expect(factors).toHaveProperty("electricity");
      expect(factors).toHaveProperty("naturalGas");
      expect(factors).toHaveProperty("meatServing");
      expect(factors).toHaveProperty("veganServing");
      expect(factors).toHaveProperty("wastePerKg");
      expect(factors).toHaveProperty("waterPerLiter");
    });

    test("emission factors are positive numbers", () => {
      const factors = CarbonCalculator.EMISSION_FACTORS;
      Object.values(factors).forEach((factor) => {
        expect(typeof factor).toBe("number");
        expect(factor).toBeGreaterThan(0);
      });
    });
  });
});
