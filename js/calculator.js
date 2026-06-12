// ========================================
// CARBON CALCULATOR - ADVANCED JS
// ========================================

"use strict";

// ========================================
// CALCULATOR INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  initializeCalculator();
});

function initializeCalculator() {
  const calculatorForm = document.getElementById("carbon-calculator");

  if (calculatorForm) {
    calculatorForm.addEventListener("submit", handleCalculatorSubmit);
    console.log("✓ Carbon calculator initialized");
  }
}

// ========================================
// EMISSION FACTORS (EPA & Global Standards)
// ========================================

const EMISSION_FACTORS = {
  // Transport (kg CO2e per unit)
  car: 0.411, // kg CO2e per km (average car)
  publicTransport: 0.089, // kg CO2e per km (bus/train average)
  flights: 0.255, // kg CO2e per km (average commercial flight)

  // Energy (kg CO2e per unit)
  electricity: 0.385, // kg CO2e per kWh (US average, varies by region)
  naturalGas: 2.04, // kg CO2e per m³

  // Food (kg CO2e per unit)
  meatServing: 6.6, // kg CO2e per serving (beef/lamb)
  veganServing: 0.8, // kg CO2e per serving

  // Waste (kg CO2e per unit)
  wastePerKg: 0.5, // kg CO2e per kg of waste
};

// ========================================
// CALCULATOR FUNCTIONS
// ========================================

function handleCalculatorSubmit(event) {
  event.preventDefault();

  // Validate form
  if (!event.target.checkValidity()) {
    event.target.classList.add("was-validated");
    return;
  }

  // Get form data
  const formData = new FormData(event.target);
  const data = {
    carKm:
      parseFloat(formData.get("car-km")) ||
      parseFloat(formData.get("transport")) ||
      0,
    publicTransport: parseFloat(formData.get("public-transport")) || 0,
    flights: parseFloat(formData.get("flights")) || 0,
    electricity: parseFloat(formData.get("electricity")) || 0,
    gas: parseFloat(formData.get("gas")) || 0,
    meat:
      parseFloat(formData.get("meat")) || parseFloat(formData.get("food")) || 0,
    vegan: parseFloat(formData.get("vegan")) || 0,
    waste: parseFloat(formData.get("waste")) || 0,
  };

  // Calculate emissions
  const results = calculateEmissions(data);

  // Display results
  displayResults(results);

  // Track event
  trackEvent("carbon_calculated", results);
}

/**
 * Calculate total carbon emissions from user input
 */
function calculateEmissions(data) {
  // Transport emissions (convert weekly km to monthly)
  const transportEmissions = {
    car: data.carKm * 4.33 * EMISSION_FACTORS.car || 0,
    publicTransport:
      data.publicTransport * 4.33 * EMISSION_FACTORS.publicTransport || 0,
    flights: data.flights * 30 * EMISSION_FACTORS.flights || 0, // rough estimate: hours to km
  };

  const totalTransport =
    transportEmissions.car +
    transportEmissions.publicTransport +
    transportEmissions.flights;

  // Energy emissions (already monthly)
  const energyEmissions = {
    electricity: data.electricity * EMISSION_FACTORS.electricity || 0,
    gas: data.gas * EMISSION_FACTORS.naturalGas || 0,
  };

  const totalEnergy = energyEmissions.electricity + energyEmissions.gas;

  // Food emissions (weekly servings converted to monthly)
  const foodEmissions = {
    meat: data.meat * 4.33 * EMISSION_FACTORS.meatServing || 0,
    vegan: data.vegan * 4.33 * EMISSION_FACTORS.veganServing || 0,
  };

  const totalFood = foodEmissions.meat + foodEmissions.vegan;

  // Waste emissions (monthly)
  const wasteEmissions = (data.waste || 0) * EMISSION_FACTORS.wastePerKg;

  // Calculate totals
  const monthlyTotal =
    totalTransport + totalEnergy + totalFood + wasteEmissions;
  const annualTotal = monthlyTotal * 12;

  // Global average for comparison (approximately 4.8 tons CO2e per person per year)
  const globalAverage = 4800; // kg CO2e per year
  const comparison = ((annualTotal - globalAverage) / globalAverage) * 100;

  // Calculate potential savings
  const potentialSavings = calculatePotentialSavings(
    data,
    transportEmissions,
    energyEmissions,
    foodEmissions,
  );

  return {
    // Monthly values
    monthlyTotal: Math.round(monthlyTotal),
    monthlyTransport: Math.round(totalTransport),
    monthlyEnergy: Math.round(totalEnergy),
    monthlyFood: Math.round(totalFood),
    monthlyWaste: Math.round(wasteEmissions),

    // Annual values
    annualTotal: Math.round(annualTotal),
    annualTransport: Math.round(totalTransport * 12),
    annualEnergy: Math.round(totalEnergy * 12),
    annualFood: Math.round(totalFood * 12),
    annualWaste: Math.round(wasteEmissions * 12),

    // Breakdown
    breakdown: {
      transport: Math.round((totalTransport / monthlyTotal) * 100) || 0,
      energy: Math.round((totalEnergy / monthlyTotal) * 100) || 0,
      food: Math.round((totalFood / monthlyTotal) * 100) || 0,
      waste: Math.round((wasteEmissions / monthlyTotal) * 100) || 0,
    },

    // Comparison
    globalAverage: Math.round(globalAverage / 12),
    comparisonPercent: Math.round(comparison),
    isAboveAverage: annualTotal > globalAverage,

    // Potential savings
    potentialSavings,

    // Sub-categories
    transportBreakdown: transportEmissions,
    energyBreakdown: energyEmissions,
    foodBreakdown: foodEmissions,
  };
}

/**
 * Calculate potential CO2 savings with lifestyle changes
 */
function calculatePotentialSavings(
  data,
  transportEmissions,
  energyEmissions,
  foodEmissions,
) {
  const savings = {
    transport: 0,
    energy: 0,
    food: 0,
    total: 0,
  };

  // Transport savings (if switching to public transport or electric vehicle)
  if (data.carKm > 0) {
    // Potential 80% savings by switching to public transport
    savings.transport = transportEmissions.car * 0.8 * 12;
  }

  // Energy savings (switch to renewable or reduce by 30%)
  savings.energy = energyEmissions.electricity * 0.3 * 12;

  // Food savings (reduce meat by 50%)
  if (data.meat > 0) {
    savings.food =
      foodEmissions.meat * 0.5 * 12 + foodEmissions.vegan * 0.25 * 12;
  }

  savings.total = savings.transport + savings.energy + savings.food;

  return {
    transport: Math.round(savings.transport),
    energy: Math.round(savings.energy),
    food: Math.round(savings.food),
    total: Math.round(savings.total),
    treesNeeded: Math.round(savings.total / 20), // One tree absorbs ~20kg CO2/year
  };
}

/**
 * Display calculation results to user
 */
function displayResults(results) {
  const resultsSection = document.getElementById("results-section");
  const liveTotalEl = document.getElementById("result-co2");
  const liveEquivalentEl = document.getElementById("result-eq");
  const progressCircle = document.getElementById("progress-circle");
  const progressPercent = document.getElementById("progress-percent");

  if (liveTotalEl) {
    animateCounter(liveTotalEl, results.monthlyTotal);
  }

  if (liveEquivalentEl) {
    const drivingKm = Math.round(results.monthlyTotal / EMISSION_FACTORS.car);
    liveEquivalentEl.textContent = `Equivalent to driving ${drivingKm.toLocaleString()} km`;
  }

  if (progressCircle) {
    const circumference = 565;
    const average = results.globalAverage || 400;
    const score = Math.max(0, Math.min(100, Math.round((results.monthlyTotal / average) * 100)));
    progressCircle.style.strokeDashoffset =
      circumference - (score / 100) * circumference;

    if (progressPercent) {
      progressPercent.textContent = `${score}%`;
    }
  }

  if (!resultsSection) {
    return;
  }

  // Show results section
  resultsSection.classList.remove("hidden");

  // Update annual total
  const annualTotalEl = document.getElementById("annual-total");
  if (annualTotalEl) {
    animateCounter(annualTotalEl, results.annualTotal);
  }

  // Update monthly average
  const monthlyAvgEl = document.getElementById("monthly-avg");
  if (monthlyAvgEl) {
    animateCounter(monthlyAvgEl, results.monthlyTotal);
  }

  // Update comparison
  const comparisonEl = document.getElementById("comparison");
  if (comparisonEl) {
    const text = results.isAboveAverage
      ? `${Math.abs(results.comparisonPercent)}% Higher`
      : `${Math.abs(results.comparisonPercent)}% Lower`;
    comparisonEl.textContent = text;
  }

  // Update breakdown chart
  updateBreakdownChart(results.breakdown);

  // Update recommendations
  updateRecommendations(results);

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Animate counter numbers
 */
function animateCounter(element, target) {
  const start = 0;
  const duration = 1000; // 1 second
  const increment = target / (duration / 16);
  let current = 0;

  const update = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  };

  requestAnimationFrame(update);
}

/**
 * Update breakdown chart
 */
function updateBreakdownChart(breakdown) {
  const chartCanvas = document.getElementById("breakdown-chart");

  if (!chartCanvas) {
    console.warn("Chart canvas not found");
    return;
  }

  // Destroy existing chart if it exists
  if (window.breakdownChart) {
    window.breakdownChart.destroy();
  }

  if (typeof Chart !== "undefined") {
    const ctx = chartCanvas.getContext("2d");

    window.breakdownChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Transport", "Energy", "Food", "Waste"],
        datasets: [
          {
            data: [
              breakdown.transport,
              breakdown.energy,
              breakdown.food,
              breakdown.waste,
            ],
            backgroundColor: [
              "rgba(22, 163, 74, 0.8)",
              "rgba(6, 182, 212, 0.8)",
              "rgba(2, 132, 199, 0.8)",
              "rgba(249, 115, 22, 0.8)",
            ],
            borderColor: [
              "rgba(22, 163, 74, 1)",
              "rgba(6, 182, 212, 1)",
              "rgba(2, 132, 199, 1)",
              "rgba(249, 115, 22, 1)",
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
            labels: {
              font: { family: "'Poppins', sans-serif", size: 14 },
              padding: 20,
            },
          },
        },
      },
    });
  }
}

/**
 * Generate and display personalized recommendations
 */
function updateRecommendations(results) {
  const recommendationsContainer = document.getElementById("recommendations");

  if (!recommendationsContainer) {
    console.warn("Recommendations container not found");
    return;
  }

  recommendationsContainer.innerHTML = "";

  const recommendations = generateRecommendations(results);

  recommendations.forEach((rec, index) => {
    const recEl = document.createElement("div");
    recEl.className =
      "p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded flex items-start space-x-3 fade-in";
    recEl.style.animationDelay = `${index * 100}ms`;

    recEl.innerHTML = `
            <div class="flex-shrink-0">
                <i class="fas ${rec.icon} text-emerald-600 text-xl"></i>
            </div>
            <div>
                <h5 class="font-semibold text-slate-900">${rec.title}</h5>
                <p class="text-sm text-slate-600 mt-1">${rec.description}</p>
                <p class="text-xs text-emerald-600 font-semibold mt-2">💚 Potential savings: ${rec.savings} kg CO₂/year</p>
            </div>
        `;

    recommendationsContainer.appendChild(recEl);
  });
}

/**
 * Generate personalized recommendations based on results
 */
function generateRecommendations(results) {
  const recommendations = [];

  // Transport recommendations
  if (
    results.transportBreakdown.car > results.transportBreakdown.publicTransport
  ) {
    recommendations.push({
      title: "Switch to Public Transport",
      description:
        "Your car emissions are high. Consider using buses, trains, or carpooling for daily commute.",
      icon: "fa-bus",
      savings: Math.round(results.potentialSavings.transport / 12),
      priority: "high",
    });
  }

  // Energy recommendations
  if (results.monthlyEnergy > 200) {
    recommendations.push({
      title: "Reduce Electricity Usage",
      description:
        "Install LED bulbs, use a programmable thermostat, and unplug devices when not in use.",
      icon: "fa-lightbulb",
      savings: Math.round(results.potentialSavings.energy / 12),
      priority: "high",
    });
  }

  // Renewable energy
  if (results.energyBreakdown.electricity > 0) {
    recommendations.push({
      title: "Switch to Renewable Energy",
      description:
        "Ask your utility about renewable energy options or consider installing solar panels.",
      icon: "fa-sun",
      savings: Math.round(
        (results.energyBreakdown.electricity * 0.6 * 12) / 12,
      ),
      priority: "medium",
    });
  }

  // Food recommendations
  if (results.foodBreakdown.meat > results.foodBreakdown.vegan * 2) {
    recommendations.push({
      title: "Reduce Meat Consumption",
      description:
        "Try Meatless Mondays or replace one meat meal per week with plant-based alternatives.",
      icon: "fa-leaf",
      savings: Math.round(results.potentialSavings.food / 12),
      priority: "high",
    });
  }

  // Tree planting
  if (results.annualTotal > 4000) {
    recommendations.push({
      title: "Plant Trees",
      description: `You could offset your emissions by planting ${results.potentialSavings.treesNeeded} trees annually.`,
      icon: "fa-tree",
      savings: Math.round(results.potentialSavings.total / 12),
      priority: "medium",
    });
  }

  // Waste reduction
  if (results.monthlyWaste > 20) {
    recommendations.push({
      title: "Reduce Waste",
      description:
        "Compost organic waste, recycle properly, and use reusable bags and containers.",
      icon: "fa-recycle",
      savings: Math.round(results.monthlyWaste * 0.5),
      priority: "medium",
    });
  }

  // Water conservation
  recommendations.push({
    title: "Conserve Water",
    description:
      "Take shorter showers, fix leaks, and use water-efficient fixtures.",
    icon: "fa-water",
    savings: 150,
    priority: "low",
  });

  // Sort by priority and return top 5
  return recommendations
    .sort(
      (a, b) =>
        ["high", "medium", "low"].indexOf(a.priority) -
        ["high", "medium", "low"].indexOf(b.priority),
    )
    .slice(0, 5);
}

// ========================================
// EXPORT FUNCTIONS FOR EXTERNAL USE
// ========================================

window.CarbonCalculator = {
  calculateEmissions,
  generateRecommendations,
  EMISSION_FACTORS,
};

console.log("✅ Carbon Calculator loaded successfully");
