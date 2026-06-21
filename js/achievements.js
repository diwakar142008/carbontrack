/**
 * Achievements Module
 * Handles badges, levels, streaks, and gamification features
 * @module achievements
 */

/**
 * CO₂ absorption rate per tree per year (kg)
 * @constant {number}
 */
const TREE_ABSORPTION_KG_PER_YEAR = 20;

/**
 * Achievement level thresholds with icons and colors
 * @type {Array<Object>}
 * @property {string} level - Level name
 * @property {number} min - Minimum score
 * @property {number} max - Maximum score
 * @property {string} icon - Font Awesome icon class
 * @property {string} color - Gradient color classes
 */
const LEVEL_THRESHOLDS = [
  {
    level: "Bronze",
    min: 0,
    max: 30,
    icon: "fa-medal",
    color: "from-orange-400 to-orange-600",
  },
  {
    level: "Silver",
    min: 31,
    max: 50,
    icon: "fa-medal",
    color: "from-slate-300 to-slate-500",
  },
  {
    level: "Gold",
    min: 51,
    max: 70,
    icon: "fa-trophy",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    level: "Platinum",
    min: 71,
    max: 85,
    icon: "fa-gem",
    color: "from-cyan-300 to-cyan-600",
  },
  {
    level: "Diamond",
    min: 86,
    max: 100,
    icon: "fa-crown",
    color: "from-blue-400 to-purple-600",
  },
];

/**
 * Available badges and their unlock conditions
 * @type {Array<Object>}
 * @property {string} id - Unique badge identifier
 * @property {string} name - Badge display name
 * @property {string} description - Badge description
 * @property {string} icon - Font Awesome icon class
 * @property {Function} condition - Function to check if badge is earned
 */
const BADGES = [
  {
    id: "first_calc",
    name: "First Steps",
    description: "Complete your first carbon calculation",
    icon: "fa-shoe-prints",
    condition: (data) => data.calculations >= 1,
  },
  {
    id: "low_footprint",
    name: "Low Impact",
    description: "Achieve a green score above 70",
    icon: "fa-leaf",
    condition: (data) => data.greenScore >= 70,
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "7-day tracking streak",
    icon: "fa-fire",
    condition: (data) => data.streak >= 7,
  },
  {
    id: "streak_30",
    name: "Monthly Master",
    description: "30-day tracking streak",
    icon: "fa-fire-flame-curved",
    condition: (data) => data.streak >= 30,
  },
  {
    id: "goal_setter",
    name: "Goal Setter",
    description: "Set your first carbon reduction goal",
    icon: "fa-bullseye",
    condition: (data) => data.goalsSet >= 1,
  },
  {
    id: "goal_crusher",
    name: "Goal Crusher",
    description: "Achieve your first goal",
    icon: "fa-star",
    condition: (data) => data.goalsAchieved >= 1,
  },
  {
    id: "eco_warrior",
    name: "Eco Warrior",
    description: "Reduce footprint by 20%",
    icon: "fa-shield-halved",
    condition: (data) => data.reduction >= 20,
  },
  {
    id: "tree_planter",
    name: "Tree Planter",
    description: "Save equivalent of 10+ trees",
    icon: "fa-tree",
    condition: (data) => data.treesSaved >= 10,
  },
  {
    id: "energy_saver",
    name: "Energy Saver",
    description: "Reduce energy emissions by 30%",
    icon: "fa-bolt",
    condition: (data) => data.energyReduction >= 30,
  },
  {
    id: "water_guardian",
    name: "Water Guardian",
    description: "Optimize water usage",
    icon: "fa-droplet",
    condition: (data) => data.waterOptimized,
  },
];

/**
 * Calculate green score based on emissions
 * @param {number} monthlyTotal - User's monthly CO₂ emissions
 * @param {number} globalAverage - Global average monthly emissions
 * @returns {number} Green score (0-100)
 */
function calculateGreenScore(monthlyTotal, globalAverage) {
  const ratio = monthlyTotal / globalAverage;
  return Math.max(0, Math.min(100, Math.round(100 - ratio * 50)));
}

/**
 * Calculate consecutive days streak
 * @param {Object} savedData - Saved user data with daily emissions
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
 * Get achievement level based on score
 * @param {number} score - Green score (0-100)
 * @returns {Object} Level object with name, icon, and color
 */
function getLevel(score) {
  return (
    LEVEL_THRESHOLDS.find((t) => score >= t.min && score <= t.max) ||
    LEVEL_THRESHOLDS[0]
  );
}

/**
 * Get all badges earned by user
 * @param {Object} userData - User statistics and metrics
 * @returns {Array<Object>} List of earned badges
 */
function getBadges(userData) {
  const earned = [];
  BADGES.forEach((badge) => {
    if (badge.condition(userData)) {
      earned.push(badge);
    }
  });
  return earned;
}

/**
 * Check and update user achievements
 * @param {Object} results - Carbon calculation results
 * @param {Object} userData - Existing user data
 * @returns {Object} Achievement results with score, level, and badges
 */
function checkAchievements(results, userData = {}) {
  const score = calculateGreenScore(
    results.monthlyTotal,
    results.globalAverage,
  );
  const userStats = {
    ...userData,
    calculations: (userData.calculations || 0) + 1,
    greenScore: score,
    lastCalculation: new Date().toISOString(),
  };

  const earnedBadges = getBadges(userStats);
  saveUserStats(userStats);
  saveEarnedBadges(earnedBadges);

  return {
    score,
    level: getLevel(score),
    badges: earnedBadges,
    newBadges: getNewBadges(earnedBadges),
  };
}

/**
 * Save user statistics to localStorage
 * @param {Object} stats - User statistics object
 * @returns {void}
 */
function saveUserStats(stats) {
  localStorage.setItem("carbontrack_stats", JSON.stringify(stats));
}

/**
 * Get user statistics from localStorage
 * @returns {Object} User statistics object
 */
function getUserStats() {
  try {
    return JSON.parse(localStorage.getItem("carbontrack_stats") || "{}");
  } catch {
    return {};
  }
}

/**
 * Save earned badge IDs to localStorage
 * @param {Array<Object>} badges - List of earned badges
 * @returns {void}
 */
function saveEarnedBadges(badges) {
  const ids = badges.map((b) => b.id);
  localStorage.setItem("carbontrack_badges", JSON.stringify(ids));
}

/**
 * Get list of earned badge IDs from localStorage
 * @returns {Array<string>} List of earned badge IDs
 */
function getEarnedBadges() {
  try {
    return JSON.parse(localStorage.getItem("carbontrack_badges") || "[]");
  } catch {
    return [];
  }
}

/**
 * Get newly earned badges (not previously earned)
 * @param {Array<Object>} currentBadges - Currently earned badges
 * @returns {Array<Object>} List of new badges
 */
function getNewBadges(currentBadges) {
  const earned = getEarnedBadges();
  return currentBadges.filter((b) => !earned.includes(b.id));
}

/**
 * Update user streak count
 * @returns {number} Updated streak count
 */
function updateStreak() {
  const stats = getUserStats();
  const lastCalc = stats.lastCalculation
    ? new Date(stats.lastCalculation)
    : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (lastCalc) {
    lastCalc.setHours(0, 0, 0, 0);
    const diffDays = (today - lastCalc) / (1000 * 60 * 60 * 24);

    if (diffDays > 1) {
      stats.streak = (stats.streak || 0) > 0 ? 0 : stats.streak;
    }
  }

  stats.streak = (stats.streak || 0) + 1;
  stats.lastCalculation = today.toISOString();
  saveUserStats(stats);

  return stats.streak;
}

/**
 * Generate comprehensive eco report
 * @param {Object} results - Carbon calculation results
 * @returns {Object} Complete eco report with score, level, badges, and impact
 */
function generateEcoReport(results) {
  const score = calculateGreenScore(
    results.monthlyTotal,
    results.globalAverage,
  );
  const level = getLevel(score);
  const streak = updateStreak();
  const userStats = getUserStats();
  const badges = getBadges({ ...userStats, greenScore: score });

  return {
    score,
    level: level.level,
    levelIcon: level.icon,
    levelColor: level.color,
    streak,
    badges,
    totalCalculations: userStats.calculations || 1,
    monthlyTotal: results.monthlyTotal,
    annualTotal: results.annualTotal,
    globalAverage: results.globalAverage,
    comparison: results.comparisonPercent,
    treesImpact: Math.round(results.annualTotal / TREE_ABSORPTION_KG_PER_YEAR),
  };
}

/**
 * Render achievement badges to DOM
 * @param {Array<Object>} badges - List of badges to render
 * @returns {Array<HTMLElement>} Array of badge elements
 */
function renderAchievementBadges(badges) {
  const container = document.getElementById("achievements-grid");
  if (!container) return [];

  container.innerHTML = badges
    .map(
      (badge) => `
      <div class="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl border border-emerald-100">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <i class="fas ${badge.icon} text-white"></i>
        </div>
        <div>
          <p class="font-semibold text-slate-900 text-sm">${badge.name}</p>
          <p class="text-xs text-slate-600">${badge.description}</p>
        </div>
      </div>
    `,
    )
    .join("");

  return container;
}

/**
 * Render level and score display
 * @param {Object} level - Level object with name, icon, color
 * @param {number} score - Green score value
 * @returns {void}
 */
function renderLevelDisplay(level, score) {
  const levelEl = document.getElementById("eco-level");
  const scoreEl = document.getElementById("green-score-value");

  if (levelEl) {
    levelEl.innerHTML = `
      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${level.color} text-white">
        <i class="fas ${level.icon} mr-1"></i>
        ${level.level}
      </span>
    `;
  }

  if (scoreEl) {
    animateCounter(scoreEl, score);
  }
}

/**
 * Animate counter from 0 to target value
 * @param {HTMLElement} element - DOM element to update
 * @param {number} target - Target value
 * @returns {void}
 */
function animateCounter(element, target) {
  if (!element) return;

  if (typeof requestAnimationFrame === "undefined") {
    element.textContent = target.toLocaleString();
    return;
  }

  const duration = 800;
  const startTime = performance.now();

  /**
   * Animation frame update function
   * @param {number} now - Current timestamp
   */
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    element.textContent = Math.round(target * progress).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

if (typeof window !== "undefined") {
  window.AchievementEngine = {
    calculateGreenScore,
    calculateStreak,
    getLevel,
    getBadges,
    checkAchievements,
    updateStreak,
    generateEcoReport,
    renderAchievementBadges,
    renderLevelDisplay,
    getUserStats,
    getEarnedBadges,
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    LEVEL_THRESHOLDS,
    BADGES,
    calculateGreenScore,
    calculateStreak,
    getLevel,
    getBadges,
    checkAchievements,
    saveUserStats,
    getUserStats,
    saveEarnedBadges,
    getEarnedBadges,
    updateStreak,
    generateEcoReport,
    renderAchievementBadges,
    renderLevelDisplay,
  };
}
