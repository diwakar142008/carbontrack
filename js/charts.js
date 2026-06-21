/**
 * Charts Module
 * Chart.js wrapper for creating and updating data visualizations
 */

function getGradient(ctx, colorStart, colorEnd, height = 320) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);
  return gradient;
}

function destroyChart(canvasId) {
  const chart = window[canvasId];
  if (chart && typeof chart.destroy === "function") {
    chart.destroy();
  }
}

function initMonthlyTrendChart() {
  const canvas = document.getElementById("monthly-trend-chart");
  if (!canvas || typeof Chart === "undefined") return;

  destroyChart("monthlyTrendChart");

  const ctx = canvas.getContext("2d");
  const gradientBar = getGradient(ctx, "rgba(16, 185, 129, 0.92)", "rgba(6, 182, 212, 0.18)");
  const gradientTarget = getGradient(ctx, "rgba(167, 243, 208, 0.55)", "rgba(167, 243, 208, 0.08)");
  const gradientLine = getGradient(ctx, "#10b981", "#06b6d4", canvas.width || 800);

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const emissions = [580, 620, 710, 650, 530, 482, 460, 490, 440, 410, 390, 365];
  const target = new Array(12).fill(420);

  window.monthlyTrendChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "CO₂ Emissions (kg)",
          data: emissions,
          backgroundColor: gradientBar,
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.6,
          categoryPercentage: 0.7,
          hoverBackgroundColor: "rgba(16, 185, 129, 1)",
        },
        {
          label: "Target",
          data: target,
          type: "line",
          borderColor: gradientLine,
          borderWidth: 2.5,
          borderDash: [6, 4],
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#10b981",
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 2,
          fill: {
            target: "origin",
            above: gradientTarget,
          },
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      animation: {
        duration: 1200,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(6, 20, 17, 0.92)",
          titleColor: "#a7f3d0",
          bodyColor: "#fff",
          titleFont: { family: "Poppins", weight: "600", size: 13 },
          bodyFont: { family: "Poppins", size: 13 },
          padding: 14,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 6,
          callbacks: {
            label: function (context) {
              if (context.dataset.label === "Target") {
                return "Target: " + context.parsed.y + " kg";
              }
              return "Emissions: " + context.parsed.y + " kg";
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#64748b",
            font: { family: "Poppins", weight: "500", size: 12 },
          },
          border: { display: false },
        },
        y: {
          beginAtZero: false,
          min: 200,
          max: 800,
          grid: {
            color: "rgba(8, 28, 21, 0.06)",
            drawBorder: false,
          },
          ticks: {
            color: "#64748b",
            font: { family: "Poppins", weight: "500", size: 12 },
            callback: function (value) {
              return value + " kg";
            },
            stepSize: 100,
          },
          border: { display: false },
        },
      },
    },
  });
}

function initCategoryBreakdownChart(breakdown) {
  const canvas = document.getElementById("breakdown-chart");
  if (!canvas || typeof Chart === "undefined") return;

  destroyChart("breakdownChart");

  const data = [
    breakdown.transport || 0,
    breakdown.energy || 0,
    breakdown.food || 0,
    breakdown.waste || 0,
    breakdown.water || 0,
  ];

  const validData = data.some((v) => v > 0);

  window.breakdownChart = new Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["Transport", "Energy", "Food", "Waste", "Water"],
      datasets: [
        {
          data: validData ? data : [1, 1, 1, 1, 1],
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
          labels: {
            font: { family: "Poppins", size: 12 },
            padding: 16,
          },
        },
      },
    },
  });
}

function initReductionProgressChart() {
  const canvas = document.getElementById("reduction-progress-chart");
  if (!canvas || typeof Chart === "undefined") return;

  destroyChart("reductionProgressChart");

  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const data = [100, 92, 85, 78];

  window.reductionProgressChart = new Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels: weeks,
      datasets: [
        {
          label: "CO₂ Emissions (kg)",
          data,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "#10b981",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(6, 20, 17, 0.92)",
          titleColor: "#a7f3d0",
          bodyColor: "#fff",
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#64748b", font: { family: "Poppins" } },
        },
        y: {
          grid: { color: "rgba(8, 28, 21, 0.06)" },
          ticks: {
            color: "#64748b",
            font: { family: "Poppins" },
            callback: (v) => v + " kg",
          },
        },
      },
    },
  });
}

function initMonthlyComparisonChart() {
  const canvas = document.getElementById("comparison-chart");
  if (!canvas || typeof Chart === "undefined") return;

  destroyChart("monthlyComparisonChart");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const thisYear = [580, 620, 710, 650, 530, 482];
  const lastYear = [650, 680, 750, 700, 600, 550];

  window.monthlyComparisonChart = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "This Year",
          data: thisYear,
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderRadius: 6,
        },
        {
          label: "Last Year",
          data: lastYear,
          backgroundColor: "rgba(148, 163, 184, 0.5)",
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { font: { family: "Poppins" } },
        },
        tooltip: {
          backgroundColor: "rgba(6, 20, 17, 0.92)",
          titleColor: "#a7f3d0",
          bodyColor: "#fff",
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#64748b", font: { family: "Poppins" } },
        },
        y: {
          grid: { color: "rgba(8, 28, 21, 0.06)" },
          ticks: {
            color: "#64748b",
            font: { family: "Poppins" },
            callback: (v) => v + " kg",
          },
        },
      },
    },
  });
}

function initAllCharts(breakdown) {
  initMonthlyTrendChart();
  initCategoryBreakdownChart(breakdown);
  initReductionProgressChart();
  initMonthlyComparisonChart();
}

if (typeof window !== "undefined") {
  window.ChartsManager = {
    initMonthlyTrendChart,
    initCategoryBreakdownChart,
    initReductionProgressChart,
    initMonthlyComparisonChart,
    initAllCharts,
    destroyChart,
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getGradient,
    destroyChart,
    initMonthlyTrendChart,
    initCategoryBreakdownChart,
    initReductionProgressChart,
    initMonthlyComparisonChart,
    initAllCharts,
  };
}
