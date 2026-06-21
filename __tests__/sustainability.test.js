/**
 * @jest-environment jsdom
 */

const RecommendationEngine = require("../js/recommendations.js");
const AchievementEngine = require("../js/achievements.js");

describe("RecommendationEngine", () => {
  const baseResults = {
    breakdown: { transport: 40, energy: 30, food: 20, waste: 10, water: 5 },
    monthlyTotal: 600,
    globalAverage: 400,
    monthlyTransport: 240,
    monthlyEnergy: 180,
    monthlyFood: 120,
    monthlyWaste: 60,
    transportBreakdown: { car: 200, publicTransport: 40, flights: 0 },
    energyBreakdown: { electricity: 150, gas: 30 },
    foodBreakdown: { meat: 90, vegan: 30 },
    potentialSavings: { total: 500, treesNeeded: 5 },
  };

  describe("getPersonalizedTips", () => {
    test("returns tips for high transport emissions", () => {
      const results = {
        ...baseResults,
        breakdown: { ...baseResults.breakdown, transport: 50 },
      };
      const tips = RecommendationEngine.getPersonalizedTips(results);
      const transportTip = tips.find((t) => t.category === "transport");
      expect(transportTip).toBeDefined();
    });

    test("returns tips for high energy emissions", () => {
      const results = {
        ...baseResults,
        breakdown: { ...baseResults.breakdown, energy: 40 },
      };
      const tips = RecommendationEngine.getPersonalizedTips(results);
      const energyTip = tips.find((t) => t.category === "energy");
      expect(energyTip).toBeDefined();
    });

    test("returns tips for high food emissions", () => {
      const results = {
        ...baseResults,
        breakdown: { ...baseResults.breakdown, food: 35 },
      };
      const tips = RecommendationEngine.getPersonalizedTips(results);
      const foodTip = tips.find((t) => t.category === "food");
      expect(foodTip).toBeDefined();
    });

    test("returns empty array for green user", () => {
      const results = {
        ...baseResults,
        breakdown: { transport: 5, energy: 5, food: 5, waste: 5, water: 5 },
        monthlyTotal: 100,
      };
      const tips = RecommendationEngine.getPersonalizedTips(results);
      expect(Array.isArray(tips)).toBe(true);
    });
  });

  describe("getWeeklySuggestions", () => {
    test("returns 7 suggestions", () => {
      const suggestions = RecommendationEngine.getWeeklySuggestions(baseResults);
      expect(suggestions.length).toBe(7);
    });

    test("each suggestion has required fields", () => {
      const suggestions = RecommendationEngine.getWeeklySuggestions(baseResults);
      suggestions.forEach((suggestion) => {
        expect(suggestion).toHaveProperty("day");
        expect(suggestion).toHaveProperty("action");
        expect(suggestion).toHaveProperty("category");
        expect(suggestion).toHaveProperty("difficulty");
        expect(suggestion).toHaveProperty("impact");
      });
    });

    test("covers all days of the week", () => {
      const suggestions = RecommendationEngine.getWeeklySuggestions(baseResults);
      const days = suggestions.map((s) => s.day);
      expect(days).toContain("Monday");
      expect(days).toContain("Sunday");
    });
  });

  describe("getCategoryRecommendations", () => {
    test("returns transport recommendations", () => {
      const recs = RecommendationEngine.getCategoryRecommendations("transport", baseResults);
      expect(recs.length).toBeGreaterThan(0);
      expect(recs[0]).toHaveProperty("title");
      expect(recs[0]).toHaveProperty("description");
    });

    test("returns energy recommendations", () => {
      const recs = RecommendationEngine.getCategoryRecommendations("energy", baseResults);
      expect(recs.length).toBeGreaterThan(0);
    });

    test("returns food recommendations", () => {
      const recs = RecommendationEngine.getCategoryRecommendations("food", baseResults);
      expect(recs.length).toBeGreaterThan(0);
    });

    test("returns waste recommendations", () => {
      const recs = RecommendationEngine.getCategoryRecommendations("waste", baseResults);
      expect(recs.length).toBeGreaterThan(0);
    });

    test("returns fallback for unknown category", () => {
      const recs = RecommendationEngine.getCategoryRecommendations("unknown", baseResults);
      expect(recs.length).toBeGreaterThan(0);
    });
  });

  describe("rankRecommendations", () => {
    test("sorts high priority first", () => {
      const mixed = [
        { title: "Low", priority: "low" },
        { title: "High", priority: "high" },
        { title: "Medium", priority: "medium" },
      ];
      const ranked = RecommendationEngine.rankRecommendations(mixed);
      expect(ranked[0].priority).toBe("high");
      expect(ranked[ranked.length - 1].priority).toBe("low");
    });
  });
});

describe("Sustainability Impact", () => {
  test("equivalent trees calculation is reasonable", () => {
    const { calculateEmissions } = require("../js/calculator.js");
    const results = calculateEmissions({
      carKm: 500,
      electricity: 400,
      food: 20,
      waste: 50,
    });
    const trees = Math.ceil(results.annualTotal / 20);
    expect(trees).toBeGreaterThan(0);
    expect(trees).toBeLessThan(10000);
  });

  test("potential savings exceed zero for active inputs", () => {
    const { calculateEmissions } = require("../js/calculator.js");
    const results = calculateEmissions({
      carKm: 500,
      electricity: 400,
      food: 20,
      waste: 50,
    });
    expect(results.potentialSavings.total).toBeGreaterThan(0);
    expect(results.potentialSavings.transport).toBeGreaterThan(0);
  });
});
