/**
 * Dashboard Module
 * Manages dashboard data, KPI updates, and impact metrics
 * @module dashboard
 */

/**
 * Maximum green score value
 * @constant {number}
 */
const GREEN_SCORE_MAX = 100;

/**
 * Tree absorption rate in kg CO₂ per year
 * @constant {number}
 */
const TREE_ABSORPTION_KG_PER_YEAR = 20;

/**
 * Maximum monthly CO₂ emissions threshold
 * @constant {number}
 */
const MAX_MONTHLY_CO2 = 1200;

/**
 * Achievement level thresholds
 * @type {Array<Object>}
 * @property {string} level - Level name
 * @property {number} min - Minimum score
 * @property {number} max - Maximum score
 */
const LEVEL_THRESHOLDS = [
  { level: "Bronze", min: 0, max: 30 },
  { level: "Silver", min: 31, max: 50 },
  { level: "Gold", min: 51, max: 70 },
  { level: "Platinum", min: 71, max: 85 },
  { level: "Diamond", min: 86, max: 100 },
];

/**
 * Calculate green score based on emissions
 * @param {number} monthlyTotal - User's monthly CO₂ emissions
 * @param {number} globalAverage - Global average monthly emissions
 * @returns {number} Green score (0-100)
 */
function calculateGreenScore(monthlyTotal, globalAverage) {
  const ratio = monthlyTotal / globalAverage;
  const score = Math.max(
    0,
    Math.min(GREEN_SCORE_MAX, Math.round(100 - ratio * 50)),
  );
  return score;
}

/**
 * Calculate consecutive days of below-average emissions
 * @param {Object} savedData - Saved dashboard data
 * @returns {number} Streak count
 */
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

/**
 * Get achievement level based on green score
 * @param {number} score - Green score (0-100)
 * @returns {Object} Level object with name and color
 */
function getLevel(score) {
  return (
    LEVEL_THRESHOLDS.find((t) => score >= t.min && score <= t.max) ||
    LEVEL_THRESHOLDS[0]
  );
}

/**
 * Calculate environmental impact metrics
 * @param {Object} results - Carbon calculation results
 * @returns {Object} Impact metrics (CO₂ saved, trees, energy, water)
 */
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

/**
 * Get current goal from localStorage
 * @returns {Object|null} Goal object or null if not set
 */
function getCurrentProgress() {
  const stored = localStorage.getItem("carbontrack_goal");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Calculate goal completion percentage
 * @param {number} current - Current value
 * @param {number} target - Target value
 * @returns {number} Completion percentage (0-100)
 */
function calculateCompletion(current, target) {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

/**
 * Get goal status based on completion
 * @param {number} current - Current value
 * @param {number} target - Target value
 * @returns {string} Status: completed, on-track, in-progress, needs-attention
 */
function getGoalStatus(current, target) {
  const completion = calculateCompletion(current, target);
  if (completion >= 100) return "completed";
  if (completion >= 75) return "on-track";
  if (completion >= 50) return "in-progress";
  return "needs-attention";
}

/**
 * Set a new carbon reduction goal
 * @param {number} target - Target CO₂ reduction in kg/month
 * @param {string} unit - Unit of measurement
 * @returns {Object} Goal object
 */
function setGoal(target, unit = "kg CO2/month") {
  const goal = {
    target,
    unit,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem("carbontrack_goal", JSON.stringify(goal));
  return goal;
}

/**
 * Validate goal input value
 * @param {string|number} value - Input value to validate
 * @returns {boolean} True if valid
 */
function validateGoalInput(value) {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) && num > 0 && num < MAX_MONTHLY_CO2;
}

/**
 * Update goal progress display
 * @param {Object} goal - Goal object
 * @param {number} current - Current emissions value
 * @returns {void}
 */
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

/**
 * Update entire dashboard with new results
 * @param {Object} results - Carbon calculation results
 * @param {Object} savedData - Previously saved dashboard data
 * @returns {void}
 */
function updateDashboard(results, savedData = {}) {
  updateKPICards(results);
  updateImpactMetrics(results);
  updateGreenScore(results);
  updateGoalSection(results);
  updateStreakDisplay(savedData);
}

/**
 * Update KPI cards with emission values
 * @param {Object} results - Carbon calculation results
 * @returns {void}
 */
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

/**
 * Update environmental impact metrics
 * @param {Object} results - Carbon calculation results
 * @returns {void}
 */
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

/**
 * Update green score display
 * @param {Object} results - Carbon calculation results
 * @returns {void}
 */
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

/**
 * Update goal section display
 * @param {Object} results - Carbon calculation results
 * @returns {void}
 */
function updateGoalSection(results) {
  const goal = getCurrentProgress();
  const current = results.monthlyTotal;
  updateGoalDisplay(goal, current);
}

/**
 * Update streak display
 * @param {Object} savedData - Saved dashboard data
 * @returns {void}
 */
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
