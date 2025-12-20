// ===================================
// FRONTEND JAVASCRIPT
// Handles UI interactions and animations
// ===================================

// Scroll to top on page load/refresh
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

window.onload = () => {
    window.scrollTo(0, 0);
};

// Navbar background change on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler (Frontend only - no backend connection yet)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your inquiry! Regina will get back to you within 24 hours via WhatsApp or phone call.');
        this.reset();
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all sections for fade-in animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ===================================
// SIMPLE AUTO-SLIDESHOW (No Controls)
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slideshow-slide');
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showNextSlide() {
        // Hide current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % totalSlides;
        
        // Show next slide
        slides[currentSlide].classList.add('active');
    }

    // Change slide every 4 seconds
    setInterval(showNextSlide, 4000);
});