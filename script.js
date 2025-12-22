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

// Form submission handler with Formspree and Custom Modal
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state with spinner
        submitButton.innerHTML = '<span class="spinner"></span> Sending...';
        submitButton.disabled = true;
        
        try {
            const formData = new FormData(this);
            const response = await fetch('https://formspree.io/f/xqezlbpn', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showModal(
                    'success',
                    '✨',
                    'Thank You!',
                    "Your email has been received! Reggies Makeovers will get back to you within 24 hours via WhatsApp or phone call. We're excited to make your special day beautiful!"
                );
                this.reset();
            } else {
                showModal(
                    'error',
                    '⚠️',
                    'Oops!',
                    "There was a problem submitting your form. Please try again."
                );
            }
        } catch (error) {
            showModal(
                'error',
                '⚠️',
                'Connection Error',
                "Unable to send your message right now. Please contact us directly via WhatsApp or Instagram."
            );
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Custom Modal Function
function showModal(type, icon, title, message) {
    // Remove existing modal if any
    const existingModal = document.getElementById('custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'custom-modal';
    modal.className = 'custom-modal';
    
    const buttonClass = type === 'error' ? 'error-btn' : '';
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <div class="modal-icon ${type}">
                ${icon}
            </div>
            <h3 class="modal-title">${title}</h3>
            <p class="modal-message">${message}</p>
            <button class="modal-button ${buttonClass}" onclick="closeModal()">
                ${type === 'success' ? 'Awesome!' : 'Got it'}
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Auto close after 8 seconds for success
    if (type === 'success') {
        setTimeout(() => {
            closeModal();
        }, 8000);
    }
}

// Close Modal Function
function closeModal() {
    const modal = document.getElementById('custom-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('custom-modal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});


// Remove fade-in animations - make sections static
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '1';
})

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

// ===================================
// GALLERY LIGHTBOX WITH NAVIGATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    let currentImageIndex = 0;
    
    // Create lightbox HTML
    const lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay">
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
            </button>
            <img class="lightbox-image" src="" alt="Bride">
            <button class="lightbox-next">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>
            <div class="lightbox-counter"></div>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    
    // Open lightbox on image click
    galleryItems.forEach((item, index) => {
        item.parentElement.addEventListener('click', () => {
            currentImageIndex = index;
            showImage(currentImageIndex);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Show image function
    function showImage(index) {
        lightboxImage.src = galleryItems[index].src;
        lightboxCounter.textContent = `${index + 1} / ${galleryItems.length}`;
    }
    
    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Previous image
    lightboxPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        showImage(currentImageIndex);
    });
    
    // Next image
    lightboxNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        showImage(currentImageIndex);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });
});

// ===================================
// TESTIMONIALS CAROUSEL
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const testimonialsContainer = document.querySelector('.testimonials-grid');
    if (!testimonialsContainer) return;
    
    const prevBtn = document.querySelector('.testimonials-prev');
    const nextBtn = document.querySelector('.testimonials-next');
    
    if (!prevBtn || !nextBtn) return;
    
    let currentPosition = 0;
    const testimonials = testimonialsContainer.querySelectorAll('.testimonial-card');
    const totalTestimonials = testimonials.length;
    
    // Determine visible cards based on screen size
    function getVisibleCards() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }
    
    function updateCarousel() {
        const visibleCards = getVisibleCards();
        const maxPosition = Math.max(0, totalTestimonials - visibleCards);
        
        // Clamp position
        currentPosition = Math.min(Math.max(0, currentPosition), maxPosition);
        
        const cardWidth = testimonials[0].offsetWidth;
        const gap = 32; // 2rem gap
        const offset = -(currentPosition * (cardWidth + gap));
        
        testimonialsContainer.style.transform = `translateX(${offset}px)`;
        
        // Update button states
        prevBtn.disabled = currentPosition === 0;
        nextBtn.disabled = currentPosition >= maxPosition;
    }
    
    prevBtn.addEventListener('click', () => {
        currentPosition--;
        updateCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
        currentPosition++;
        updateCarousel();
    });
    
    // Update on window resize
    window.addEventListener('resize', updateCarousel);
    
    // Initial update
    updateCarousel();
});
