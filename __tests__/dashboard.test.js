/**
 * @jest-environment jsdom
 */

const DashboardManager = require("../js/dashboard.js");
const AchievementEngine = require("../js/achievements.js");

describe("DashboardManager", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    localStorage.clear();
    window.monthlyTrendChart = { destroy: jest.fn() };
    window.breakdownChart = { destroy: jest.fn() };
  });

  describe("calculateGreenScore", () => {
    test("returns 100 for zero emissions", () => {
      const score = DashboardManager.calculateGreenScore(0, 400);
      expect(score).toBe(100);
    });

    test("returns 0 for very high emissions", () => {
      const score = DashboardManager.calculateGreenScore(2000, 400);
      expect(score).toBe(0);
    });

    test("returns middle score for average emissions", () => {
      const score = DashboardManager.calculateGreenScore(400, 400);
      expect(score).toBe(50);
    });

    test("clamps score between 0 and 100", () => {
      expect(
        DashboardManager.calculateGreenScore(-100, 400),
      ).toBeGreaterThanOrEqual(0);
      expect(
        DashboardManager.calculateGreenScore(10000, 400),
      ).toBeLessThanOrEqual(100);
    });
  });

  describe("calculateStreak", () => {
    test("returns 0 for empty data", () => {
      expect(DashboardManager.calculateStreak(null)).toBe(0);
      expect(DashboardManager.calculateStreak({})).toBe(0);
      expect(DashboardManager.calculateStreak({ dailyEmissions: [] })).toBe(0);
    });

    test("returns correct streak count", () => {
      const savedData = {
        dailyEmissions: [300, 280, 290, 270, 260],
      };
      const streak = DashboardManager.calculateStreak(savedData);
      expect(streak).toBeGreaterThan(0);
    });

    test("stops streak when emission goes above average", () => {
      const savedData = {
        dailyEmissions: [300, 280, 350, 270, 260],
      };
      const streak = DashboardManager.calculateStreak(savedData);
      expect(streak).toBeLessThan(5);
    });
  });

  describe("getLevel", () => {
    test("returns Bronze for score 0", () => {
      expect(DashboardManager.getLevel(0).level).toBe("Bronze");
    });

    test("returns Diamond for score 95", () => {
      expect(DashboardManager.getLevel(95).level).toBe("Diamond");
    });

    test("returns Silver for score 40", () => {
      expect(DashboardManager.getLevel(40).level).toBe("Silver");
    });

    test("returns Gold for score 60", () => {
      expect(DashboardManager.getLevel(60).level).toBe("Gold");
    });
  });

  describe("getImpactMetrics", () => {
    test("calculates trees equivalent from monthly total", () => {
      const metrics = DashboardManager.getImpactMetrics({ monthlyTotal: 600 });
      expect(metrics.treesEquivalent).toBeGreaterThan(0);
    });

    test("calculates from potential savings", () => {
      const metrics = DashboardManager.getImpactMetrics({
        monthlyTotal: 600,
        potentialSavings: { total: 1200, treesNeeded: 5 },
      });
      expect(metrics.co2Saved).toBeGreaterThan(0);
      expect(metrics.treesEquivalent).toBe(5);
    });

    test("returns all required metrics", () => {
      const metrics = DashboardManager.getImpactMetrics({ monthlyTotal: 600 });
      expect(metrics).toHaveProperty("co2Saved");
      expect(metrics).toHaveProperty("treesEquivalent");
      expect(metrics).toHaveProperty("energySaved");
      expect(metrics).toHaveProperty("waterSaved");
      expect(metrics).toHaveProperty("wasteReduced");
    });
  });

  describe("Goal Management", () => {
    test("validates goal input correctly", () => {
      expect(DashboardManager.validateGoalInput("500")).toBe(true);
      expect(DashboardManager.validateGoalInput("100")).toBe(true);
      expect(DashboardManager.validateGoalInput("-100")).toBe(false);
      expect(DashboardManager.validateGoalInput("0")).toBe(false);
      expect(DashboardManager.validateGoalInput("abc")).toBe(false);
      expect(DashboardManager.validateGoalInput("2000")).toBe(false);
    });

    test("calculates completion correctly", () => {
      expect(DashboardManager.calculateCompletion(100, 200)).toBe(50);
      expect(DashboardManager.calculateCompletion(200, 200)).toBe(100);
      expect(DashboardManager.calculateCompletion(300, 200)).toBe(100);
      expect(DashboardManager.calculateCompletion(0, 200)).toBe(0);
    });

    test("returns correct goal status", () => {
      expect(DashboardManager.getGoalStatus(200, 200)).toBe("completed");
      expect(DashboardManager.getGoalStatus(160, 200)).toBe("on-track");
      expect(DashboardManager.getGoalStatus(120, 200)).toBe("in-progress");
      expect(DashboardManager.getGoalStatus(50, 200)).toBe("needs-attention");
    });

    test("sets and retrieves goals from localStorage", () => {
      const goal = DashboardManager.setGoal(400, "kg CO2/month");
      expect(goal.target).toBe(400);
      expect(goal.unit).toBe("kg CO2/month");

      const retrieved = DashboardManager.getCurrentProgress();
      expect(retrieved.target).toBe(400);
    });

    test("returns null when no goal is set", () => {
      localStorage.removeItem("carbontrack_goal");
      expect(DashboardManager.getCurrentProgress()).toBeNull();
    });
  });
});

describe("AchievementEngine", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    localStorage.clear();
  });

  describe("calculateGreenScore", () => {
    test("returns 100 for zero emissions", () => {
      expect(AchievementEngine.calculateGreenScore(0, 400)).toBe(100);
    });

    test("returns 50 for emissions at global average", () => {
      expect(AchievementEngine.calculateGreenScore(400, 400)).toBe(50);
    });

    test("clamps score between 0 and 100", () => {
      expect(
        AchievementEngine.calculateGreenScore(-100, 400),
      ).toBeGreaterThanOrEqual(0);
      expect(
        AchievementEngine.calculateGreenScore(10000, 400),
      ).toBeLessThanOrEqual(100);
    });
  });

  describe("getLevel", () => {
    test("returns correct level for score 95", () => {
      const level = AchievementEngine.getLevel(95);
      expect(level.level).toBe("Diamond");
    });

    test("returns correct level for score 75", () => {
      const level = AchievementEngine.getLevel(75);
      expect(level.level).toBe("Platinum");
    });

    test("returns correct level for score 60", () => {
      const level = AchievementEngine.getLevel(60);
      expect(level.level).toBe("Gold");
    });
  });

  describe("getBadges", () => {
    test("returns badges for qualifying user data", () => {
      const badges = AchievementEngine.getBadges({
        greenScore: 75,
        calculations: 2,
        streak: 10,
      });
      expect(badges.length).toBeGreaterThan(0);
    });

    test("returns empty array for new user", () => {
      const badges = AchievementEngine.getBadges({});
      expect(Array.isArray(badges)).toBe(true);
    });

    test("First Steps badge requires at least 1 calculation", () => {
      const badges = AchievementEngine.getBadges({
        calculations: 1,
        greenScore: 50,
      });
      const firstSteps = badges.find((b) => b.id === "first_calc");
      expect(firstSteps).toBeDefined();
    });
  });

  describe("checkAchievements", () => {
    test("returns score, level, and badges", () => {
      const results = {
        monthlyTotal: 500,
        globalAverage: 400,
        monthlyTransport: 200,
        monthlyEnergy: 150,
        monthlyFood: 100,
        monthlyWaste: 50,
        annualTotal: 6000,
        comparisonPercent: 5,
      };

      const achievements = AchievementEngine.checkAchievements(results);
      expect(achievements).toHaveProperty("score");
      expect(achievements).toHaveProperty("level");
      expect(achievements).toHaveProperty("badges");
    });

    test("increments calculation count", () => {
      const results = {
        monthlyTotal: 500,
        globalAverage: 400,
        monthlyTransport: 200,
        monthlyEnergy: 150,
        monthlyFood: 100,
        monthlyWaste: 50,
        annualTotal: 6000,
        comparisonPercent: 5,
      };

      AchievementEngine.checkAchievements(results);
      const stats = AchievementEngine.getUserStats();
      expect(stats.calculations).toBe(1);
    });
  });

  describe("generateEcoReport", () => {
    test("generates complete eco report", () => {
      const results = {
        monthlyTotal: 500,
        globalAverage: 400,
        annualTotal: 6000,
        comparisonPercent: 5,
      };

      const report = AchievementEngine.generateEcoReport(results);
      expect(report).toHaveProperty("score");
      expect(report).toHaveProperty("level");
      expect(report).toHaveProperty("streak");
      expect(report).toHaveProperty("badges");
      expect(report).toHaveProperty("monthlyTotal");
      expect(report).toHaveProperty("annualTotal");
      expect(report).toHaveProperty("treesImpact");
    });

    test("report trees impact is positive", () => {
      const results = {
        monthlyTotal: 500,
        globalAverage: 400,
        annualTotal: 6000,
        comparisonPercent: 5,
      };

      const report = AchievementEngine.generateEcoReport(results);
      expect(report.treesImpact).toBeGreaterThan(0);
    });
  });
});
