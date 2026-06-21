/**
 * Dashboard Module
 * Manages dashboard data, KPI updates, and impact metrics
 */

const GREEN_SCORE_MAX = 100;
const TREE_ABSORPTION_KG_PER_YEAR = 20;
const MAX_MONTHLY_CO2 = 1200;
const LEVEL_THRESHOLDS = [
  { level: "Bronze", min: 0, max: 30 },
  { level: "Silver", min: 31, max: 50 },
  { level: "Gold", min: 51, max: 70 },
  { level: "Platinum", min: 71, max: 85 },
  { level: "Diamond", min: 86, max: 100 },
];

function calculateGreenScore(monthlyTotal, globalAverage) {
  const ratio = monthlyTotal / globalAverage;
  const score = Math.max(
    0,
    Math.min(GREEN_SCORE_MAX, Math.round(100 - ratio * 50)),
  );
  return score;
}

function calculateStreak(savedData) {
  if (!savedData || !Array.isArray(savedData.dailyEmissions)) return 0;
  let streak = 0;
  const emissions = savedData.dailyEmissions.slice().reverse();
  const avg = emissions.reduce((a, b) => a + b, 0) / emissions.length || 1;

  for (const emission of emissions) {
    if (emission < avg) streak++;
    else break;
  }
  return streak;
}

function getLevel(score) {
  return (
    LEVEL_THRESHOLDS.find((t) => score >= t.min && score <= t.max) ||
    LEVEL_THRESHOLDS[0]
  );
}

function getImpactMetrics(results) {
  const monthlyTotal = results.monthlyTotal || 0;
  const potentialSavings = results.potentialSavings || {
    total: 0,
    treesNeeded: 0,
  };

  return {
    co2Saved: Math.round(potentialSavings.total / 12),
    treesEquivalent:
      potentialSavings.treesNeeded ||
      Math.round(monthlyTotal / TREE_ABSORPTION_KG_PER_YEAR),
    energySaved: Math.round(potentialSavings.energy / 12),
    waterSaved: Math.round(potentialSavings.water / 12),
    wasteReduced: Math.round(potentialSavings.food / 12),
  };
}

function getCurrentProgress() {
  const stored = localStorage.getItem("carbontrack_goal");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function calculateCompletion(current, target) {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

function getGoalStatus(current, target) {
  const completion = calculateCompletion(current, target);
  if (completion >= 100) return "completed";
  if (completion >= 75) return "on-track";
  if (completion >= 50) return "in-progress";
  return "needs-attention";
}

function setGoal(target, unit = "kg CO2/month") {
  const goal = {
    target,
    unit,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem("carbontrack_goal", JSON.stringify(goal));
  return goal;
}

function validateGoalInput(value) {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) && num > 0 && num < MAX_MONTHLY_CO2;
}

function updateGoalDisplay(goal, current) {
  const progressBar = document.getElementById("goal-progress-bar");
  const progressText = document.getElementById("goal-progress-text");
  const goalTarget = document.getElementById("goal-target");

  if (!goal) return;

  const completion = calculateCompletion(current, goal.target);

  if (progressBar) {
    progressBar.style.width = `${completion}%`;
    progressBar.setAttribute("aria-valuenow", completion);
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", 100);
  }

  if (progressText) {
    progressText.textContent = `${completion}%`;
  }

  if (goalTarget) {
    goalTarget.textContent = `Target: ${goal.target} ${goal.unit}`;
  }
}

function updateDashboard(results, savedData = {}) {
  updateKPICards(results);
  updateImpactMetrics(results);
  updateGreenScore(results);
  updateGoalSection(results);
  updateStreakDisplay(savedData);
}

function updateKPICards(results) {
  const cards = {
    daily: document.getElementById("dashboard-daily"),
    weekly: document.getElementById("dashboard-weekly"),
    monthly: document.getElementById("dashboard-monthly"),
    annual: document.getElementById("dashboard-annual"),
  };

  if (cards.daily) {
    cards.daily.textContent = `${Math.round(results.monthlyTotal / 30)} kg`;
  }
  if (cards.weekly) {
    cards.weekly.textContent = `${Math.round(results.monthlyTotal / 4.33)} kg`;
  }
  if (cards.monthly) {
    cards.monthly.textContent = `${results.monthlyTotal} kg`;
  }
  if (cards.annual) {
    cards.annual.textContent = `${results.annualTotal.toLocaleString()} kg`;
  }
}

function updateImpactMetrics(results) {
  const metrics = getImpactMetrics(results);
  const fields = {
    "metric-co2-saved": metrics.co2Saved,
    "metric-trees": metrics.treesEquivalent,
    "metric-energy": metrics.energySaved,
    "metric-water": metrics.waterSaved,
  };

  Object.entries(fields).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) {
      animateCounter(el, value);
    }
  });
}

function updateGreenScore(results) {
  const score = calculateGreenScore(
    results.monthlyTotal,
    results.globalAverage,
  );
  const scoreEl = document.getElementById("green-score-value");
  const levelEl = document.getElementById("green-score-level");
  const level = getLevel(score);

  if (scoreEl) {
    animateCounter(scoreEl, score);
  }
  if (levelEl) {
    levelEl.textContent = level.level;
  }
}

function updateGoalSection(results) {
  const goal = getCurrentProgress();
  const current = results.monthlyTotal;
  updateGoalDisplay(goal, current);
}

function updateStreakDisplay(savedData) {
  const streak = calculateStreak(savedData);
  const streakEl = document.getElementById("streak-count");
  if (streakEl) {
    streakEl.textContent = streak;
  }
}

if (typeof window !== "undefined") {
  window.DashboardManager = {
    calculateGreenScore,
    calculateStreak,
    getLevel,
    getImpactMetrics,
    getCurrentProgress,
    calculateCompletion,
    getGoalStatus,
    setGoal,
    validateGoalInput,
    updateGoalDisplay,
    updateDashboard,
    updateKPICards,
    updateImpactMetrics,
    updateGreenScore,
    updateGoalSection,
    updateStreakDisplay,
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateGreenScore,
    calculateStreak,
    getLevel,
    getImpactMetrics,
    getCurrentProgress,
    calculateCompletion,
    getGoalStatus,
    setGoal,
    validateGoalInput,
    updateGoalDisplay,
    updateDashboard,
    updateKPICards,
    updateImpactMetrics,
    updateGreenScore,
    updateGoalSection,
    updateStreakDisplay,
  };
}
