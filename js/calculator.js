/**
 * Carbon Calculator Module
 * Pure calculation logic for carbon footprint analysis
 * @module calculator
 */

/**
 * Emission factors for different activities (kg CO₂ per unit)
 * Based on EPA and international standards
 * @constant {Object}
 * @type {Object}
 */
const EMISSION_FACTORS = Object.freeze({
  car: 0.411,
  publicTransport: 0.089,
  flights: 0.255,
  electricity: 0.385,
  naturalGas: 2.04,
  meatServing: 6.6,
  veganServing: 0.8,
  wastePerKg: 0.5,
  waterPerLiter: 0.0003,
});

/**
 * Weeks per month (average)
 * @constant {number}
 */
const MONTHS_PER_WEEK = 4.33;

/**
 * Days per month (average)
 * @constant {number}
 */
const DAYS_PER_MONTH = 30;

/**
 * Global average annual CO₂ emissions per person (kg)
 * @constant {number}
 */
const GLOBAL_AVERAGE_ANNUAL_KG = 4800;

/**
 * CO₂ absorption rate per tree per year (kg)
 * @constant {number}
 */
const TREE_ABSORPTION_KG_PER_YEAR = 20;

/**
 * Maximum monthly CO₂ emissions threshold
 * @constant {number}
 */
const MAX_MONTHLY_CO2 = 1200;

/**
 * Convert value to positive number or zero
 * @param {*} value - Value to convert
 * @returns {number} Positive number or 0
 */
function toNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

/**
 * Normalize user input to standard format
 * @param {Object} data - Raw user input data
 * @returns {Object} Normalized input with all fields
 */
function normalizeInput(data = {}) {
  return {
    carKm: toNumber(data.carKm ?? data.transport ?? data["car-km"]),
    publicTransport: toNumber(data.publicTransport ?? data["public-transport"]),
    flights: toNumber(data.flights),
    electricity: toNumber(data.electricity),
    gas: toNumber(data.gas),
    meat: toNumber(data.meat ?? data.food),
    vegan: toNumber(data.vegan),
    waste: toNumber(data.waste),
    water: toNumber(data.water),
  };
}

/**
 * Extract form data from HTML form
 * @param {HTMLFormElement} form - Form element
 * @returns {Object} Normalized form data
 */
function getFormData(form) {
  const formData = new FormData(form);
  return normalizeInput(Object.fromEntries(formData));
}

/**
 * Calculate transport-related emissions
 * @param {Object} data - Normalized input data
 * @returns {Object} Transport emissions breakdown
 */
function calculateTransportEmissions(data) {
  return {
    car: data.carKm * MONTHS_PER_WEEK * EMISSION_FACTORS.car,
    publicTransport:
      data.publicTransport * MONTHS_PER_WEEK * EMISSION_FACTORS.publicTransport,
    flights: data.flights * DAYS_PER_MONTH * EMISSION_FACTORS.flights,
  };
}

/**
 * Calculate energy-related emissions
 * @param {Object} data - Normalized input data
 * @returns {Object} Energy emissions breakdown
 */
function calculateEnergyEmissions(data) {
  return {
    electricity: data.electricity * EMISSION_FACTORS.electricity,
    gas: data.gas * EMISSION_FACTORS.naturalGas,
  };
}

/**
 * Calculate food-related emissions
 * @param {Object} data - Normalized input data
 * @returns {Object} Food emissions breakdown
 */
function calculateFoodEmissions(data) {
  return {
    meat: data.meat * MONTHS_PER_WEEK * EMISSION_FACTORS.meatServing,
    vegan: data.vegan * MONTHS_PER_WEEK * EMISSION_FACTORS.veganServing,
  };
}

/**
 * Calculate water-related emissions
 * @param {Object} data - Normalized input data
 * @returns {number} Water emissions
 */
function calculateWaterEmissions(data) {
  return data.water * EMISSION_FACTORS.waterPerLiter * DAYS_PER_MONTH;
}

/**
 * Sum all values in an object
 * @param {Object} values - Object with numeric values
 * @returns {number} Sum of all values
 */
function sumValues(values) {
  return Object.values(values).reduce((sum, value) => sum + value, 0);
}

/**
 * Calculate percentage
 * @param {number} part - Part value
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
function getPercent(part, total) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

/**
 * Calculate emissions breakdown by category
 * @param {Object} totals - Emissions totals
 * @returns {Object} Breakdown percentages
 */
function calculateBreakdown(totals) {
  return {
    transport: getPercent(totals.transport, totals.monthly),
    energy: getPercent(totals.energy, totals.monthly),
    food: getPercent(totals.food, totals.monthly),
    waste: getPercent(totals.waste, totals.monthly),
    water: getPercent(totals.water, totals.monthly),
  };
}

/**
 * Calculate potential CO₂ savings from recommended actions
 * @param {Object} data - Normalized input data
 * @param {Object} transportEmissions - Transport emissions breakdown
 * @param {Object} energyEmissions - Energy emissions breakdown
 * @param {Object} foodEmissions - Food emissions breakdown
 * @returns {Object} Potential savings by category
 */
function calculatePotentialSavings(
  data,
  transportEmissions,
  energyEmissions,
  foodEmissions,
) {
  const transport = data.carKm > 0 ? transportEmissions.car * 0.8 * 12 : 0;
  const energy = energyEmissions.electricity * 0.3 * 12;
  const food =
    data.meat > 0
      ? foodEmissions.meat * 0.5 * 12 + foodEmissions.vegan * 0.25 * 12
      : 0;
  const water =
    data.water > 0
      ? data.water * EMISSION_FACTORS.waterPerLiter * DAYS_PER_MONTH * 12 * 0.3
      : 0;
  const total = transport + energy + food + water;

  return {
    transport: Math.round(transport),
    energy: Math.round(energy),
    food: Math.round(food),
    water: Math.round(water),
    total: Math.round(total),
    treesNeeded: Math.round(total / TREE_ABSORPTION_KG_PER_YEAR),
  };
}

/**
 * Calculate complete carbon emissions from raw data
 * @param {Object} rawData - Raw user input data
 * @returns {Object} Complete emissions results with breakdowns
 */
function calculateEmissions(rawData = {}) {
  const data = normalizeInput(rawData);
  const transportBreakdown = calculateTransportEmissions(data);
  const energyBreakdown = calculateEnergyEmissions(data);
  const foodBreakdown = calculateFoodEmissions(data);
  const wasteEmissions = data.waste * EMISSION_FACTORS.wastePerKg;
  const waterEmissions = calculateWaterEmissions(data);

  const totals = {
    transport: sumValues(transportBreakdown),
    energy: sumValues(energyBreakdown),
    food: sumValues(foodBreakdown),
    waste: wasteEmissions,
    water: waterEmissions,
  };
  totals.monthly =
    totals.transport +
    totals.energy +
    totals.food +
    totals.waste +
    totals.water;

  const annualTotal = totals.monthly * 12;
  const comparison =
    ((annualTotal - GLOBAL_AVERAGE_ANNUAL_KG) / GLOBAL_AVERAGE_ANNUAL_KG) * 100;

  return {
    monthlyTotal: Math.round(totals.monthly),
    monthlyTransport: Math.round(totals.transport),
    monthlyEnergy: Math.round(totals.energy),
    monthlyFood: Math.round(totals.food),
    monthlyWaste: Math.round(totals.waste),
    monthlyWater: Math.round(totals.water),
    annualTotal: Math.round(annualTotal),
    annualTransport: Math.round(totals.transport * 12),
    annualEnergy: Math.round(totals.energy * 12),
    annualFood: Math.round(totals.food * 12),
    annualWaste: Math.round(totals.waste * 12),
    annualWater: Math.round(totals.water * 12),
    breakdown: calculateBreakdown(totals),
    globalAverage: Math.round(GLOBAL_AVERAGE_ANNUAL_KG / 12),
    comparisonPercent: Math.round(comparison),
    isAboveAverage: annualTotal > GLOBAL_AVERAGE_ANNUAL_KG,
    potentialSavings: calculatePotentialSavings(
      data,
      transportBreakdown,
      energyBreakdown,
      foodBreakdown,
    ),
    transportBreakdown,
    energyBreakdown,
    foodBreakdown,
  };
}

/**
 * Generate impact-based recommendations
 * @param {Object} results - Carbon calculation results
 * @returns {Array<Object>} List of recommendations
 */
function getImpactRecommendations(results) {
  const recommendations = [];

  if (
    results.transportBreakdown.car > results.transportBreakdown.publicTransport
  ) {
    recommendations.push({
      title: "Switch to Public Transport",
      description:
        "Replace some car trips with buses, trains, biking, walking, or carpooling.",
      icon: "fa-bus",
      savings: Math.round(results.potentialSavings.transport / 12),
      priority: "high",
      category: "transport",
    });
  }

  if (results.monthlyEnergy > 200) {
    recommendations.push({
      title: "Reduce Electricity Usage",
      description:
        "Use LED lighting, improve thermostat settings, and unplug idle devices.",
      icon: "fa-lightbulb",
      savings: Math.round(results.potentialSavings.energy / 12),
      priority: "high",
      category: "energy",
    });
  }

  if (results.foodBreakdown.meat > results.foodBreakdown.vegan * 2) {
    recommendations.push({
      title: "Reduce Meat Consumption",
      description:
        "Try plant-based swaps for high-impact meals and track the monthly change.",
      icon: "fa-leaf",
      savings: Math.round(results.potentialSavings.food / 12),
      priority: "high",
      category: "food",
    });
  }

  if (results.energyBreakdown.electricity > 0) {
    recommendations.push({
      title: "Choose Renewable Electricity",
      description:
        "Check utility green plans, rooftop solar, or community solar options.",
      icon: "fa-sun",
      savings: Math.round(results.energyBreakdown.electricity * 0.6),
      priority: "medium",
      category: "energy",
    });
  }

  if (results.monthlyWaste > 20) {
    recommendations.push({
      title: "Reduce Waste",
      description:
        "Compost organics, recycle correctly, and replace single-use packaging.",
      icon: "fa-recycle",
      savings: Math.round(results.monthlyWaste * 0.5),
      priority: "medium",
      category: "waste",
    });
  }

  if (results.monthlyWater > 5000) {
    recommendations.push({
      title: "Conserve Water",
      description:
        "Fix leaks, install low-flow fixtures, and reduce shower time.",
      icon: "fa-water",
      savings: Math.round(results.monthlyWater * 0.0003 * 0.4),
      priority: "medium",
      category: "water",
    });
  }

  return recommendations;
}

/**
 * Generate personalized recommendations sorted by priority
 * @param {Object} results - Carbon calculation results
 * @returns {Array<Object>} Sorted recommendations (max 5)
 */
function generateRecommendations(results) {
  const recommendations = getImpactRecommendations(results);

  recommendations.push({
    title: "Track Monthly Progress",
    description:
      "Recalculate each month and compare category changes against your target.",
    icon: "fa-chart-line",
    savings: Math.max(25, Math.round(results.monthlyTotal * 0.05)),
    priority: "low",
    category: "general",
  });

  return recommendations
    .sort(
      (a, b) =>
        ["high", "medium", "low"].indexOf(a.priority) -
        ["high", "medium", "low"].indexOf(b.priority),
    )
    .slice(0, 5);
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

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    element.textContent = Math.round(target * progress).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Update live summary display with results
 * @param {Object} results - Carbon calculation results
 * @returns {void}
 */
function updateLiveSummary(results) {
  const liveTotalEl = document.getElementById("result-co2");
  const liveEquivalentEl = document.getElementById("result-eq");
  const progressCircle = document.getElementById("progress-circle");
  const progressPercent = document.getElementById("progress-percent");

  animateCounter(liveTotalEl, results.monthlyTotal);

  if (liveEquivalentEl) {
    const drivingKm = Math.round(results.monthlyTotal / EMISSION_FACTORS.car);
    liveEquivalentEl.textContent = `Equivalent to driving ${drivingKm.toLocaleString()} km`;
  }

  if (progressCircle) {
    const circumference = 2 * Math.PI * 90;
    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round((results.monthlyTotal / results.globalAverage) * 100),
      ),
    );
    progressCircle.style.strokeDashoffset =
      circumference - (score / 100) * circumference;

    if (progressPercent) {
      progressPercent.textContent = `${score}%`;
    }
  }
}

/**
 * Update dashboard summary section
 * @param {Object} results - Carbon calculation results
 * @returns {void}
 */
function updateDashboardSummary(results) {
  const resultsSection = document.getElementById("results-section");
  if (!resultsSection) return;

  resultsSection.classList.remove("hidden");
  animateCounter(document.getElementById("annual-total"), results.annualTotal);
  animateCounter(document.getElementById("monthly-avg"), results.monthlyTotal);

  const comparisonEl = document.getElementById("comparison");
  if (comparisonEl) {
    const direction = results.isAboveAverage ? "Higher" : "Lower";
    comparisonEl.textContent = `${Math.abs(results.comparisonPercent)}% ${direction}`;
  }

  updateBreakdownChart(results.breakdown);
  updateRecommendations(results);
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Display calculation results to user
 * @param {Object} results - Carbon calculation results
 * @returns {void}
 */
function displayResults(results) {
  updateLiveSummary(results);
  updateDashboardSummary(results);
}

/**
 * Update breakdown doughnut chart
 * @param {Object} breakdown - Emissions breakdown percentages
 * @returns {void}
 */
function updateBreakdownChart(breakdown) {
  const chartCanvas = document.getElementById("breakdown-chart");
  if (!chartCanvas || typeof Chart === "undefined") return;

  if (window.breakdownChart) {
    window.breakdownChart.destroy();
  }

  window.breakdownChart = new Chart(chartCanvas.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["Transport", "Energy", "Food", "Waste", "Water"],
      datasets: [
        {
          data: [
            breakdown.transport,
            breakdown.energy,
            breakdown.food,
            breakdown.waste,
            breakdown.water,
          ],
          backgroundColor: [
            "rgba(22, 163, 74, 0.8)",
            "rgba(6, 182, 212, 0.8)",
            "rgba(2, 132, 199, 0.8)",
            "rgba(249, 115, 22, 0.8)",
            "rgba(168, 85, 247, 0.8)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

/**
 * Create recommendation card element
 * @param {Object} rec - Recommendation object
 * @param {number} index - Index for animation delay
 * @returns {HTMLElement} Recommendation card element
 */
function createRecommendationElement(rec, index) {
  const recEl = document.createElement("div");
  recEl.className =
    "p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded flex items-start space-x-3 fade-in";
  recEl.style.animationDelay = `${index * 100}ms`;

  const iconWrap = document.createElement("div");
  iconWrap.className = "flex-shrink-0";

  const icon = document.createElement("i");
  icon.className = `fas ${rec.icon} text-emerald-600 text-xl`;
  icon.setAttribute("aria-hidden", "true");
  iconWrap.appendChild(icon);

  const body = document.createElement("div");
  const title = document.createElement("h5");
  title.className = "font-semibold text-slate-900";
  title.textContent = rec.title;

  const description = document.createElement("p");
  description.className = "text-sm text-slate-600 mt-1";
  description.textContent = rec.description;

  const savings = document.createElement("p");
  savings.className = "text-xs text-emerald-600 font-semibold mt-2";
  savings.textContent = `Potential savings: ${rec.savings} kg CO2/year`;

  body.append(title, description, savings);
  recEl.append(iconWrap, body);
  return recEl;
}

/**
 * Update recommendations display
 * @param {Object} results - Carbon calculation results
 * @returns {void}
 */
function updateRecommendations(results) {
  const recommendationsContainer = document.getElementById("recommendations");
  if (!recommendationsContainer) return;

  recommendationsContainer.replaceChildren();
  generateRecommendations(results).forEach((rec, index) => {
    recommendationsContainer.appendChild(
      createRecommendationElement(rec, index),
    );
  });
}

/**
 * Handle calculator form submission
 * @param {Event} event - Form submit event
 * @returns {void}
 */
function handleCalculatorSubmit(event) {
  event.preventDefault();

  if (!event.target.checkValidity()) {
    event.target.classList.add("was-validated");
    return;
  }

  const results = calculateEmissions(getFormData(event.target));
  displayResults(results);

  if (typeof trackEvent === "function") {
    trackEvent("carbon_calculated", results);
  }
}

/**
 * Initialize calculator on page load
 * @returns {void}
 */
function initializeCalculator() {
  const calculatorForm = document.getElementById("carbon-calculator");
  if (!calculatorForm) return;

  calculatorForm.addEventListener("submit", handleCalculatorSubmit);
  displayResults(calculateEmissions(getFormData(calculatorForm)));
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initializeCalculator);
}

const CarbonCalculator = {
  EMISSION_FACTORS,
  normalizeInput,
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateFoodEmissions,
  calculateWaterEmissions,
  calculatePotentialSavings,
  calculateEmissions,
  generateRecommendations,
  animateCounter,
  updateLiveSummary,
  updateDashboardSummary,
  displayResults,
  updateBreakdownChart,
  updateRecommendations,
  handleCalculatorSubmit,
  initializeCalculator,
};

if (typeof window !== "undefined") {
  window.CarbonCalculator = CarbonCalculator;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = CarbonCalculator;
}
