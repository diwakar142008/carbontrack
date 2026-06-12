// ========================================
// GSAP & SCROLL TRIGGER ANIMATIONS
// ========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initializeGSAPAnimations();
});

function initializeGSAPAnimations() {
  if (typeof gsap === "undefined") {
    console.warn("⚠ GSAP not loaded. Animations skipped.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Initialize all GSAP animations
  initHeroAnimations();
  initSectionAnimations();
  initCardAnimations();
  initTextAnimations();
  initParallaxEffects();

  console.log("✓ GSAP animations initialized");
}

// ========================================
// HERO SECTION ANIMATIONS
// ========================================

function initHeroAnimations() {
  const tl = gsap.timeline();

  // Hero heading
  tl.fromTo(
    ".hero-heading",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    0,
  );

  // Hero subtitle
  tl.fromTo(
    ".hero-subtitle",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    0.2,
  );

  // Hero buttons
  tl.fromTo(
    ".hero-buttons",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    0.4,
  );

  // Scroll indicator pulse
  gsap.to(".scroll-indicator", {
    y: 10,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

// ========================================
// SECTION ANIMATIONS
// ========================================

function initSectionAnimations() {
  // About section
  animateSectionOnScroll("#about", {
    heading: ".about-heading",
    cards: ".stats-card",
  });

  // Dashboard section
  animateSectionOnScroll("#dashboard", {
    heading: ".dashboard-heading",
    cards: ".dashboard-card",
  });

  // Features section
  animateSectionOnScroll("#features", {
    heading: ".features-heading",
    cards: ".feature-card",
  });

  // Recommendations section
  animateSectionOnScroll("#recommendations", {
    heading: ".recommendations-heading",
    cards: ".recommendation-card",
  });

  // Testimonials section
  animateSectionOnScroll("#testimonials", {
    heading: ".testimonials-heading",
    cards: ".testimonial-card",
  });
}

/**
 * Animate section elements on scroll trigger
 */
function animateSectionOnScroll(sectionSelector, elements) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  // Animate heading
  if (elements.heading) {
    const heading = section.querySelector(elements.heading);
    if (heading) {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            once: true,
          },
        },
      );
    }
  }

  // Animate cards with stagger
  if (elements.cards) {
    const cards = section.querySelectorAll(elements.cards);
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            once: true,
          },
        },
      );
    }
  }
}

// ========================================
// CARD ANIMATIONS
// ========================================

function initCardAnimations() {
  // Hover lift effect for feature cards
  document
    .querySelectorAll(".feature-card, .dashboard-card")
    .forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -10,
          boxShadow: "0 20px 40px rgba(22, 163, 74, 0.15)",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          boxShadow: "none",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });
}

// ========================================
// TEXT ANIMATIONS
// ========================================

function initTextAnimations() {
  // Split text animation
  document.querySelectorAll(".split-text").forEach((element) => {
    const text = element.textContent;
    element.innerHTML = text
      .split("")
      .map((char) => `<span class="letter">${char}</span>`)
      .join("");

    const letters = element.querySelectorAll(".letter");
    gsap.fromTo(
      letters,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          once: true,
        },
      },
    );
  });
}

// ========================================
// PARALLAX EFFECTS
// ========================================

function initParallaxEffects() {
  // Parallax background
  gsap.utils.toArray(".parallax").forEach((element) => {
    gsap.to(element, {
      backgroundPosition: "50% 100%",
      ease: "none",
      scrollTrigger: {
        trigger: element,
        scrub: true,
        markers: false,
      },
    });
  });

  // Floating elements
  gsap.utils.toArray(".floating-earth, .floating-leaf").forEach((element) => {
    gsap.to(element, {
      y: gsap.utils.random(-20, 20),
      duration: gsap.utils.random(3, 5),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });
}

// ========================================
// SCROLL REVEAL ANIMATION
// ========================================

function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          });
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    },
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}

// ========================================
// MAGNETIC BUTTON EFFECT
// ========================================

function initMagneticButtons() {
  document.querySelectorAll(".magnetic-btn").forEach((button) => {
    button.addEventListener("mousemove", (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    button.addEventListener("mouseleave", () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "back.out",
      });
    });
  });
}

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================

function initRippleEffect() {
  document.querySelectorAll("button:not(.no-ripple)").forEach((button) => {
    button.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.className = "ripple-effect";

      button.appendChild(ripple);

      gsap.to(ripple, {
        scale: 4,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      });
    });
  });
}

// ========================================
// CHART ANIMATIONS
// ========================================

function animateChart(canvas) {
  if (window.breakdownChart) {
    // Add animation to chart
    gsap.to(window.breakdownChart.ctx, {
      duration: 1,
      onUpdate: () => {
        window.breakdownChart.update();
      },
    });
  }
}

// ========================================
// PROGRESS BAR ANIMATION
// ========================================

function animateProgressBar(progressSelector) {
  gsap.utils.toArray(progressSelector).forEach((element) => {
    gsap.fromTo(
      element,
      { width: 0 },
      {
        width: element.getAttribute("data-progress") || "100%",
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          once: true,
        },
      },
    );
  });
}

// ========================================
// INITIALIZE ALL ANIMATIONS
// ========================================

// Call initialization function
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeGSAPAnimations);
} else {
  initializeGSAPAnimations();
}

console.log("✅ GSAP animations module loaded");
