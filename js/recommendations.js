/**
 * Recommendations Module
 * AI-powered sustainability recommendation engine
 */

function getPersonalizedTips(results) {
  const tips = [];
  const breakdown = results.breakdown || {};

  if (breakdown.transport > 30) {
    tips.push({
      category: "transport",
      tip: "Your transport emissions are high. Consider carpooling or public transit 2-3 days per week.",
      impact: "Could save 150-300 kg CO2/month",
    });
  }

  if (breakdown.energy > 25) {
    tips.push({
      category: "energy",
      tip: "Switch to LED bulbs and unplug idle electronics. A smart thermostat can save 10-15% on energy bills.",
      impact: "Could save 50-100 kg CO2/month",
    });
  }

  if (breakdown.food > 20) {
    tips.push({
      category: "food",
      tip: "Try 'Meatless Mondays' and reducing red meat consumption. Plant-based meals have 75% lower footprint.",
      impact: "Could save 100-200 kg CO2/month",
    });
  }

  if (breakdown.waste > 15) {
    tips.push({
      category: "waste",
      tip: "Start composting organic waste and buy products with minimal packaging. Aim for zero waste lunches.",
      impact: "Could save 30-60 kg CO2/month",
    });
  }

  if (breakdown.water > 10) {
    tips.push({
      category: "water",
      tip: "Install low-flow showerheads and fix leaky faucets. Take 5-minute showers to save water and energy.",
      impact: "Could save 20-40 kg CO2/month",
    });
  }

  return tips;
}

function getWeeklySuggestions(results) {
  const suggestions = [];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  dayNames.forEach((day, index) => {
    const suggestion = {
      day,
      action: "",
      category: "general",
      difficulty: "easy",
    };

    if (index % 3 === 0) {
      suggestion.action = "Bike or walk to work/school instead of driving";
      suggestion.category = "transport";
      suggestion.impact = "~5 kg CO2 saved";
    } else if (index % 3 === 1) {
      suggestion.action = "Use cold water for laundry and hang-dry clothes";
      suggestion.category = "energy";
      suggestion.impact = "~2 kg CO2 saved";
    } else {
      suggestion.action = "Try a plant-based meal for lunch and dinner";
      suggestion.category = "food";
      suggestion.impact = "~4 kg CO2 saved";
    }

    suggestions.push(suggestion);
  });

  return suggestions;
}

function getCategoryRecommendations(category, results) {
  const categoryResults = {
    transport: results.transportBreakdown || {},
    energy: results.energyBreakdown || {},
    food: results.foodBreakdown || {},
  };

  const recommendations = {
    transport: [
      {
        title: "Use Public Transportation",
        description: "Buses and trains emit 80% less per passenger than single-occupancy cars.",
        icon: "fa-bus",
        savings: "150-300 kg CO2/month",
      },
      {
        title: "Bike or Walk Short Distances",
        description: "Trips under 5 km are perfect for cycling or walking. Zero emissions and great exercise.",
        icon: "fa-bicycle",
        savings: "50-100 kg CO2/month",
      },
      {
        title: "Carpool to Work",
        description: "Sharing rides cuts per-person emissions in half and saves on fuel costs.",
        icon: "fa-car",
        savings: "100-200 kg CO2/month",
      },
      {
        title: "Consider Electric Vehicles",
        description: "EVs produce 60% fewer emissions than gas cars over their lifetime.",
        icon: "fa-charging-station",
        savings: "200-400 kg CO2/month",
      },
    ],
    energy: [
      {
        title: "Switch to LED Lighting",
        description: "LED bulbs use 75% less energy and last 25x longer than incandescent bulbs.",
        icon: "fa-lightbulb",
        savings: "30-60 kg CO2/month",
      },
      {
        title: "Unplug Idle Devices",
        description: "Phantom power from idle devices accounts for 5-10% of home energy use.",
        icon: "fa-plug",
        savings: "20-40 kg CO2/month",
      },
      {
        title: "Use a Smart Thermostat",
        description: "Programmable thermostats can reduce heating/cooling costs by 10-15%.",
        icon: "fa-temperature-half",
        savings: "40-80 kg CO2/month",
      },
      {
        title: "Switch to Renewable Energy",
        description: "Green energy plans or rooftop solar can eliminate electricity emissions.",
        icon: "fa-sun",
        savings: "100-300 kg CO2/month",
      },
    ],
    food: [
      {
        title: "Reduce Red Meat Consumption",
        description: "Beef has 20x the footprint of beans. Try plant-based alternatives.",
        icon: "fa-leaf",
        savings: "100-200 kg CO2/month",
      },
      {
        title: "Buy Local and Seasonal",
        description: "Local food travels shorter distances, reducing transport emissions.",
        icon: "fa-apple-whole",
        savings: "30-60 kg CO2/month",
      },
      {
        title: "Reduce Food Waste",
        description: "Plan meals, store food properly, and compost scraps. Food waste is a major emissions source.",
        icon: "fa-utensils",
        savings: "40-80 kg CO2/month",
      },
    ],
    waste: [
      {
        title: "Start Composting",
        description: "Composting organic waste reduces landfill methane and creates nutrient-rich soil.",
        icon: "fa-recycle",
        savings: "30-60 kg CO2/month",
      },
      {
        title: "Use Reusable Bags and Containers",
        description: "Eliminate single-use plastics. Keep reusable bags in your car and bag kit at work.",
        icon: "fa-bag-shopping",
        savings: "10-20 kg CO2/month",
      },
    ],
    water: [
      {
        title: "Install Low-Flow Fixtures",
        description: "Low-flow showerheads and faucets reduce water use by 30-50%.",
        icon: "fa-shower",
        savings: "15-30 kg CO2/month",
      },
      {
        title: "Fix Leaky Faucets",
        description: "A single drip per second wastes over 3,000 gallons per year.",
        icon: "fa-wrench",
        savings: "10-20 kg CO2/month",
      },
    ],
  };

  return recommendations[category] || recommendations.transport;
}

function rankRecommendations(recommendations) {
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
  });
}

if (typeof window !== "undefined") {
  window.RecommendationEngine = {
    getPersonalizedTips,
    getWeeklySuggestions,
    getCategoryRecommendations,
    rankRecommendations,
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getPersonalizedTips,
    getWeeklySuggestions,
    getCategoryRecommendations,
    rankRecommendations,
  };
}
