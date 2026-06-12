// ========================================
// CARBON FOOTPRINT TRACKER - MAIN APP JS
// ========================================

"use strict";

// ========================================
// INITIALIZATION & GLOBALS
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌍 CarbonTrack Application Initialized");
  initializeApp();
});

function initializeApp() {
  // Initialize all components
  initLenisScroll();
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initParticleBackground();
  initCounterAnimation();
  initFAQAccordion();
  initFormValidation();
  initPerfectScroll();
  initAccessibility();
}

// ========================================
// LENIS SMOOTH SCROLL
// ========================================

function initLenisScroll() {
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: "vertical",
      gestureDirection: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    console.log("✓ Lenis Smooth Scroll initialized");
  }
}

// ========================================
// NAVBAR FUNCTIONALITY
// ========================================

function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  // Navbar scroll effect
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    },
    { passive: true },
  );

  // Smooth scroll to sections
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        closeMobileMenu();
      }
    });
  });

  console.log("✓ Navbar initialized");
}

// ========================================
// MOBILE MENU
// ========================================

function initMobileMenu() {
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      const isExpanded =
        mobileMenuToggle.getAttribute("aria-expanded") === "true";
      mobileMenuToggle.setAttribute("aria-expanded", !isExpanded);
      mobileMenu.classList.toggle("hidden");
    });

    console.log("✓ Mobile menu initialized");
  }
}

function closeMobileMenu() {
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenu && mobileMenuToggle) {
    mobileMenu.classList.add("hidden");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
  }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("⚠ GSAP or ScrollTrigger not loaded");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Fade in elements on scroll
  const fadeElements = document.querySelectorAll('[class*="fade-in"]');
  fadeElements.forEach((element) => {
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "top 20%",
        once: true,
      },
    });
  });

  // Stagger animations
  const staggerItems = document.querySelectorAll(".stagger-item");
  if (staggerItems.length > 0) {
    gsap.to(staggerItems, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: staggerItems[0],
        start: "top 80%",
        once: true,
      },
    });
  }

  console.log("✓ Scroll animations initialized");
}

// ========================================
// PARTICLE BACKGROUND
// ========================================

function initParticleBackground() {
  const particleBg = document.getElementById("particle-bg");
  if (!particleBg) return;

  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    const size = Math.random() * 3 + 1;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    const left = Math.random() * 100;

    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.left = left + "%";
    particle.style.animationDuration = duration + "s";
    particle.style.animationDelay = delay + "s";

    particleBg.appendChild(particle);
  }

  console.log("✓ Particle background initialized");
}

// ========================================
// COUNTER ANIMATION
// ========================================

function initCounterAnimation() {
  const counters = document.querySelectorAll('[class*="counter"]');

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps

    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };

    // Trigger animation on scroll into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(counter);
  });

  console.log("✓ Counter animation initialized");
}

// ========================================
// FAQ ACCORDION
// ========================================

function initFAQAccordion() {
  const faqButtons = document.querySelectorAll(".faq-button");

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const faqItem = button.closest(".faq-item");
      const faqContent = faqItem.querySelector(".faq-content");
      const isActive = faqContent.classList.contains("active");

      // Close all other items
      document.querySelectorAll(".faq-content.active").forEach((content) => {
        if (content !== faqContent) {
          content.classList.remove("active");
          content.previousElementSibling
            .querySelector("i")
            .classList.remove("rotate-180");
        }
      });

      // Toggle current item
      faqContent.classList.toggle("active", !isActive);
      button.querySelector("i").classList.toggle("rotate-180", !isActive);
    });
  });

  console.log("✓ FAQ accordion initialized");
}

// ========================================
// FORM VALIDATION
// ========================================

function initFormValidation() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    if (form.id === "carbon-calculator") {
      return;
    }

    form.addEventListener("submit", (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        form.classList.add("was-validated");
      } else {
        e.preventDefault();
        handleFormSubmit(form);
      }

      form.classList.add("was-validated");
    });

    // Real-time validation
    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("change", () => {
        validateInput(input);
      });
      input.addEventListener("blur", () => {
        validateInput(input);
      });
    });
  });

  console.log("✓ Form validation initialized");
}

function validateInput(input) {
  if (!input.value) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }

  // Email validation
  if (input.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
      return false;
    }
  }

  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  return true;
}

function handleFormSubmit(form) {
  console.log("Form submitted:", form.id);

  // Prevent default and show success message
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  console.log("Form data:", data);

  // Show success message
  showSuccessMessage("Thank you! Your message has been received.");

  // Reset form
  setTimeout(() => {
    form.reset();
    form.classList.remove("was-validated");
  }, 1500);
}

function showSuccessMessage(message) {
  const messageEl = document.createElement("div");
  messageEl.className =
    "fixed top-20 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce";
  messageEl.textContent = message;

  document.body.appendChild(messageEl);

  setTimeout(() => {
    messageEl.remove();
  }, 3000);
}

// ========================================
// SCROLL TO TOP FUNCTIONALITY
// ========================================

function initScrollToTop() {
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.id = "scroll-to-top";
  scrollToTopBtn.className =
    "fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-3 rounded-full shadow-lg opacity-0 invisible transition-all duration-300 z-40";
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.setAttribute("aria-label", "Scroll to top");

  document.body.appendChild(scrollToTopBtn);

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.remove("opacity-0", "invisible");
      } else {
        scrollToTopBtn.classList.add("opacity-0", "invisible");
      }
    },
    { passive: true },
  );

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ========================================
// PERFECT SCROLL INDICATOR
// ========================================

function initPerfectScroll() {
  const scrollIndicator = document.createElement("div");
  scrollIndicator.className =
    "fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 z-50 transition-all duration-300";
  scrollIndicator.id = "scroll-progress";
  document.body.appendChild(scrollIndicator);

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollIndicator.style.width = scrollPercent + "%";
    },
    { passive: true },
  );

  console.log("✓ Scroll progress indicator initialized");
}

// ========================================
// ACCESSIBILITY IMPROVEMENTS
// ========================================

function initAccessibility() {
  // Ensure all interactive elements have proper ARIA labels
  document.querySelectorAll("button:not([aria-label])").forEach((btn) => {
    if (!btn.textContent.trim()) {
      btn.setAttribute("aria-label", "Button");
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    // Escape key closes mobile menu
    if (e.key === "Escape") {
      closeMobileMenu();
    }

    // Skip to main content
    if (e.key === "Escape" && e.ctrlKey) {
      document.querySelector("#main-content")?.focus();
    }
  });

  console.log("✓ Accessibility features initialized");
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to optimize scroll and resize events
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}

/**
 * Safe DOM manipulation with XSS prevention
 */
function safeSetHTML(element, html) {
  const temp = document.createElement("div");
  temp.textContent = html;
  return temp.innerHTML;
}

/**
 * Log analytics
 */
function trackEvent(eventName, eventData = {}) {
  console.log(`📊 Event: ${eventName}`, eventData);
  // Can be connected to analytics service later
}

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener("error", (event) => {
  console.error("❌ Error caught:", event.error);
  // In production, send to error tracking service
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("❌ Unhandled promise rejection:", event.reason);
  // In production, send to error tracking service
});

// ========================================
// PERFORMANCE MONITORING
// ========================================

if (window.performance && window.performance.timing) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      console.log(`⏱️ Page load time: ${loadTime}ms`);
      trackEvent("page_load", { loadTime });
    }, 0);
  });
}

console.log("✅ Carbon Footprint Tracker App loaded successfully");
