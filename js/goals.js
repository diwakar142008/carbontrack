/**
 * Goals Module
 * Goal tracking and progress management
 */

const MAX_MONTHLY_CO2 = 1200;

function validateGoalInput(value) {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) && num > 0 && num < MAX_MONTHLY_CO2;
}

function setGoal(target, unit = "kg CO2/month") {
  const goal = {
    target,
    unit,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem("carbontrack_goal", JSON.stringify(goal));
  return goal;
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
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

function getGoalStatus(current, target) {
  const completion = calculateCompletion(current, target);
  if (completion >= 100) return "completed";
  if (completion >= 75) return "on-track";
  if (completion >= 50) return "in-progress";
  return "needs-attention";
}

function updateGoalProgress(results) {
  const goal = getCurrentProgress();
  if (!goal) return;

  const current = results.monthlyTotal || 0;
  const completion = calculateCompletion(current, goal.target);
  const status = getGoalStatus(current, goal.target);

  updateGoalDisplay(goal, current, status);
  saveGoalHistory(current, goal.target, completion, status);

  return { completion, status };
}

function saveGoalHistory(current, target, completion, status) {
  const history = JSON.parse(localStorage.getItem("carbontrack_goal_history") || "[]");
  history.unshift({
    date: new Date().toISOString(),
    current,
    target,
    completion,
    status,
  });

  if (history.length > 30) history.pop();
  localStorage.setItem("carbontrack_goal_history", JSON.stringify(history));
}

function getGoalHistory() {
  try {
    return JSON.parse(localStorage.getItem("carbontrack_goal_history") || "[]");
  } catch {
    return [];
  }
}

function updateGoalDisplay(goal, current, status) {
  const progressBar = document.getElementById("goal-progress-bar");
  const progressText = document.getElementById("goal-progress-text");
  const goalTarget = document.getElementById("goal-target");
  const goalStatus = document.getElementById("goal-status");
  const currentEl = document.getElementById("goal-current");

  if (!goal) return;

  const completion = calculateCompletion(current, goal.target);

  if (progressBar) {
    progressBar.style.width = `${completion}%`;
    progressBar.setAttribute("aria-valuenow", completion);
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", 100);
    progressBar.className = `h-full rounded-full transition-all duration-1000 ${getProgressBarClass(status)}`;
  }

  if (progressText) {
    progressText.textContent = `${completion}%`;
  }

  if (goalTarget) {
    goalTarget.textContent = `Target: ${goal.target} ${goal.unit}`;
  }

  if (goalStatus) {
    goalStatus.textContent = status.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
    goalStatus.className = `text-sm font-medium ${getStatusClass(status)}`;
  }

  if (currentEl) {
    currentEl.textContent = `${current} kg CO₂`;
  }
}

function getProgressBarClass(status) {
  switch (status) {
    case "completed":
      return "bg-gradient-to-r from-green-400 to-emerald-500";
    case "on-track":
      return "bg-gradient-to-r from-cyan-400 to-emerald-500";
    case "in-progress":
      return "bg-gradient-to-r from-yellow-400 to-orange-500";
    default:
      return "bg-gradient-to-r from-red-400 to-orange-500";
  }
}

function getStatusClass(status) {
  switch (status) {
    case "completed":
      return "text-green-600";
    case "on-track":
      return "text-cyan-600";
    case "in-progress":
      return "text-yellow-600";
    default:
      return "text-red-600";
  }
}

function createGoalSection(results) {
  const goal = getCurrentProgress();
  const current = results.monthlyTotal || 0;
  const completion = goal ? calculateCompletion(current, goal.target) : 0;
  const status = goal ? getGoalStatus(current, goal.target) : "not-set";

  return {
    goal,
    current,
    completion,
    status,
    hasGoal: !!goal,
  };
}

function initGoalTracking(results) {
  const goalSection = document.getElementById("goal-section");
  if (!goalSection) return;

  const sectionData = createGoalSection(results);
  renderGoalSection(sectionData);
  updateGoalProgress(results);
}

function renderGoalSection(sectionData) {
  const container = document.getElementById("goal-container");
  if (!container) return;

  container.innerHTML = `
    <div class="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-slate-900">Monthly Carbon Goal</h3>
        <span id="goal-status" class="text-sm font-medium ${
          sectionData.status === "not-set" ? "text-slate-500" : getStatusClass(sectionData.status)
        }">${sectionData.status === "not-set" ? "No goal set" : sectionData.status.replace("-", " ")}</span>
      </div>
      
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-1">
          <span class="text-slate-600">Progress</span>
          <span id="goal-progress-text" class="font-semibold text-emerald-600">${sectionData.completion}%</span>
        </div>
        <div class="w-full bg-slate-200 rounded-full h-3" role="progressbar" aria-valuenow="${sectionData.completion}" aria-valuemin="0" aria-valuemax="100">
          <div id="goal-progress-bar" class="h-full rounded-full transition-all duration-1000 ${
            sectionData.status === "not-set" ? "bg-slate-400" : getProgressBarClass(sectionData.status)
          }" style="width: ${sectionData.completion}%"></div>
        </div>
      </div>
      
      <div class="flex justify-between text-sm">
        <span id="goal-current" class="text-slate-600">Current: ${sectionData.current} kg CO₂</span>
        <span id="goal-target" class="font-medium text-slate-900">${
          sectionData.goal ? `Target: ${sectionData.goal.target} ${sectionData.goal.unit}` : "No target set"
        }</span>
      </div>
      
      <form id="goal-form" class="mt-4 pt-4 border-t border-slate-200">
        <label for="goal-input" class="block text-sm font-medium text-slate-700 mb-2">Set new target (kg CO₂/month)</label>
        <div class="flex gap-2">
          <input 
            type="number" 
            id="goal-input" 
            placeholder="e.g., 400" 
            min="1" 
            max="${MAX_MONTHLY_CO2}"
            class="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            aria-describedby="goal-help"
          >
          <button 
            type="submit" 
            class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
          >
            Set Goal
          </button>
        </div>
        <p id="goal-help" class="text-xs text-slate-500 mt-1">Recommended: 50% below your current footprint</p>
      </form>
    </div>
  `;

  const goalForm = document.getElementById("goal-form");
  if (goalForm) {
    goalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("goal-input");
      const value = input.value.trim();

      if (validateGoalInput(value)) {
        setGoal(Number.parseFloat(value));
        updateGoalDisplay(
          { target: Number.parseFloat(value), unit: "kg CO2/month" },
          sectionData.current,
          "in-progress"
        );
        renderGoalSection({
          ...sectionData,
          goal: { target: Number.parseFloat(value), unit: "kg CO2/month" },
          status: "in-progress",
        });
      }
    });
  }
}

if (typeof window !== "undefined") {
  window.GoalManager = {
    validateGoalInput,
    setGoal,
    getCurrentProgress,
    calculateCompletion,
    getGoalStatus,
    updateGoalProgress,
    initGoalTracking,
    renderGoalSection,
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validateGoalInput,
    setGoal,
    getCurrentProgress,
    calculateCompletion,
    getGoalStatus,
    updateGoalProgress,
    initGoalTracking,
    renderGoalSection,
  };
}
