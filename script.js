// ========================================
// CARBON FOOTPRINT TRACKER - JAVASCRIPT
// ========================================

// Initialize Lenis smooth scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// ========================================
// SCROLL ANIMATIONS
// ========================================

gsap.registerPlugin(ScrollTrigger);

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll progress bar
const createScrollProgress = () => {
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / scrollHeight) * 100;
        scrollProgress.style.width = progress + '%';
    });
};

createScrollProgress();

// Animate elements on scroll
const animateOnScroll = () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section) => {
        const elements = section.querySelectorAll(
            'h2, h3, p, .stats-card, .dashboard-card, .recommendation-card, .feature-card, .eco-tip, .testimonial-card, .faq-item'
        );
        
        elements.forEach((el) => {
            gsap.fromTo(
                el,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 80%',
                        end: 'top 50%',
                        markers: false,
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });
    });
};

// Stagger animations for cards
const staggerCards = () => {
    const cardGroups = [
        document.querySelectorAll('.stats-card'),
        document.querySelectorAll('.dashboard-card'),
        document.querySelectorAll('.recommendation-card'),
        document.querySelectorAll('.feature-card'),
    ];
    
    cardGroups.forEach((cards) => {
        gsap.fromTo(
            cards,
            {
                opacity: 0,
                y: 30,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: cards[0],
                    start: 'top 80%',
                },
            }
        );
    });
};

// Parallax effect for hero section
const heroParallax = () => {
    const heroSection = document.getElementById('home');
    if (heroSection) {
        gsap.to(heroSection, {
            y: (self) => -self.getVelocity() * 0.2,
            ease: 'power1.out',
            scrollTrigger: {
                trigger: heroSection,
                onUpdate: (self) => {
                    gsap.to(heroSection, {
                        y: -self.getVelocity() * 0.2,
                        overwrite: 'auto',
                        duration: 1,
                    });
                },
            },
        });
    }
};

// ========================================
// COUNTER ANIMATION
// ========================================

const animateCounters = () => {
    const counters = document.querySelectorAll('.counter, .counter-card');
    
    counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2;
        let current = 0;
        
        const updateCounter = () => {
            current += target / (duration * 60);
            
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        gsap.fromTo(
            counter,
            { opacity: 0 },
            {
                opacity: 1,
                onStart: updateCounter,
                scrollTrigger: {
                    trigger: counter,
                    start: 'top 80%',
                    once: true,
                },
            }
        );
    });
};

// ========================================
// CARBON CALCULATOR
// ========================================

const initializeCalculator = () => {
    const form = document.getElementById('calculator-form');
    const resultCo2 = document.getElementById('result-co2');
    const resultEq = document.getElementById('result-eq');
    const progressCircle = document.getElementById('progress-circle');
    const progressPercent = document.getElementById('progress-percent');
    
    // Emission factors (kg CO2 per unit)
    const emissionFactors = {
        transport: 0.21, // per km
        electricity: 0.5, // per kWh
        food: 5, // per kg of meat
        waste: 0.5, // per kg
    };
    
    const calculateFootprint = () => {
        const transport = parseFloat(form.transport.value) || 0;
        const electricity = parseFloat(form.electricity.value) || 0;
        const food = parseFloat(form.food.value) || 0;
        const waste = parseFloat(form.waste.value) || 0;
        
        const co2 = Math.round(
            transport * emissionFactors.transport +
            electricity * emissionFactors.electricity +
            food * emissionFactors.food +
            waste * emissionFactors.waste
        );
        
        // Update result
        gsap.to(resultCo2, {
            textContent: co2,
            duration: 1,
            snap: { textContent: 1 },
            ease: 'power2.out',
        });
        
        // Update equivalent
        const km = Math.round(co2 / emissionFactors.transport);
        gsap.to(resultEq, {
            textContent: `Equivalent to driving ${km.toLocaleString()} km`,
            duration: 0.5,
        });
        
        // Update progress
        const maxCo2 = 900; // Average max
        const percentage = Math.min((co2 / maxCo2) * 100, 100);
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (percentage / 100) * circumference;
        
        gsap.to(progressCircle, {
            strokeDashoffset: offset,
            duration: 1.5,
            ease: 'power2.out',
        });
        
        gsap.to(progressPercent, {
            textContent: Math.round(percentage),
            duration: 1,
            snap: { textContent: 1 },
            ease: 'power2.out',
        });
    };
    
    // Event listeners
    if (form) {
        form.addEventListener('input', calculateCalculator);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateFootprint();
        });
        
        // Calculate on page load
        calculateFootprint();
    }
};

// ========================================
// FAQ ACCORDION
// ========================================

const initializeFAQ = () => {
    const faqButtons = document.querySelectorAll('.faq-button');
    
    faqButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other items
            document.querySelectorAll('.faq-item').forEach((item) => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    const content = item.querySelector('.faq-content');
                    gsap.to(content, {
                        maxHeight: 0,
                        duration: 0.3,
                        ease: 'power2.inOut',
                    });
                }
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
                const content = faqItem.querySelector('.faq-content');
                gsap.to(content, {
                    maxHeight: content.scrollHeight,
                    duration: 0.3,
                    ease: 'power2.inOut',
                });
            } else {
                faqItem.classList.remove('active');
                const content = faqItem.querySelector('.faq-content');
                gsap.to(content, {
                    maxHeight: 0,
                    duration: 0.3,
                    ease: 'power2.inOut',
                });
            }
        });
    });
};

// ========================================
// SMOOTH NAVIGATION
// ========================================

const initializeNavigation = () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                lenis.scrollTo(targetSection, {
                    offset: -100,
                    duration: 1.5,
                });
            }
        });
    });
};

// ========================================
// HOVER EFFECTS
// ========================================

const initializeHoverEffects = () => {
    // Card tilt effect
    const cards = document.querySelectorAll(
        '.recommendation-card, .testimonial-card, .feature-card, .eco-tip, .dashboard-card'
    );
    
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * 5;
            const rotateY = ((centerX - x) / centerX) * 5;
            
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.3,
                ease: 'power2.out',
                transformPerspective: 1000,
                overwrite: 'auto',
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.3,
                ease: 'power2.out',
            });
        });
    });
};

// ========================================
// RIPPLE EFFECT FOR BUTTONS
// ========================================

const initializeRippleEffect = () => {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('div');
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)';
            ripple.style.borderRadius = '50%';
            ripple.style.pointerEvents = 'none';
            ripple.style.transform = 'scale(0)';
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            gsap.to(ripple, {
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
            });
            
            gsap.to(ripple, {
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                delay: 0.2,
                onComplete: () => ripple.remove(),
            });
        });
    });
};

// ========================================
// FORM SUBMISSION
// ========================================

const initializeForms = () => {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Add success animation
            const button = contactForm.querySelector('button');
            const originalText = button.innerHTML;
            
            gsap.to(button, {
                scale: 0.95,
                duration: 0.2,
            });
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check mr-2"></i> Message Sent!';
                button.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                
                gsap.to(button, {
                    scale: 1,
                    duration: 0.2,
                });
                
                // Reset after 3 seconds
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                    contactForm.reset();
                }, 3000);
            }, 100);
        });
    }
};

// ========================================
// MOBILE MENU
// ========================================

const initializeMobileMenu = () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            // Add mobile menu functionality here
            console.log('Mobile menu clicked');
        });
    }
};

// ========================================
// INITIALIZE ALL
// ========================================

const initialize = () => {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupAll();
        });
    } else {
        setupAll();
    }
};

const setupAll = () => {
    console.log('Initializing Carbon Footprint Tracker');
    
    // Initialize all features
    animateOnScroll();
    staggerCards();
    heroParallax();
    animateCounters();
    initializeCalculator();
    initializeFAQ();
    initializeNavigation();
    initializeHoverEffects();
    initializeRippleEffect();
    initializeForms();
    initializeMobileMenu();
    
    // Refresh ScrollTrigger after images load
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
};

// Start initialization
initialize();

// ========================================
// HELPER FUNCTIONS
// ========================================

// Format numbers with commas
const formatNumber = (num) => {
    return num.toLocaleString();
};

// Calculate carbon reduction percentage
const calculateReduction = (original, reduced) => {
    return Math.round(((original - reduced) / original) * 100);
};

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Lazy load images
const initializeLazyLoad = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach((img) => imageObserver.observe(img));
};

// ========================================
// ACCESSIBILITY
// ========================================

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals/dropdowns
    }
});

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
});

// ========================================
// UTILITY FUNCTION FOR CALCULATOR
// ========================================

function calculateCalculator() {
    const form = document.getElementById('calculator-form');
    const emissionFactors = {
        transport: 0.21,
        electricity: 0.5,
        food: 5,
        waste: 0.5,
    };
    
    const transport = parseFloat(form.transport.value) || 0;
    const electricity = parseFloat(form.electricity.value) || 0;
    const food = parseFloat(form.food.value) || 0;
    const waste = parseFloat(form.waste.value) || 0;
    
    const co2 = Math.round(
        transport * emissionFactors.transport +
        electricity * emissionFactors.electricity +
        food * emissionFactors.food +
        waste * emissionFactors.waste
    );
    
    const resultCo2 = document.getElementById('result-co2');
    const resultEq = document.getElementById('result-eq');
    const progressCircle = document.getElementById('progress-circle');
    const progressPercent = document.getElementById('progress-percent');
    
    if (resultCo2) {
        resultCo2.textContent = co2;
    }
    if (resultEq) {
        resultEq.textContent = `Equivalent to driving ${Math.round(co2 / emissionFactors.transport).toLocaleString()} km`;
    }
    
    if (progressCircle && progressPercent) {
        const maxCo2 = 900;
        const percentage = Math.min((co2 / maxCo2) * 100, 100);
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (percentage / 100) * circumference;
        
        progressCircle.style.strokeDashoffset = offset;
        progressPercent.textContent = Math.round(percentage);
    }
}
