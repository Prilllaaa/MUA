let slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

setInterval(nextSlide, 5000);
