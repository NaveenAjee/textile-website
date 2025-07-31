// Slider JavaScript for Textile Business Website

class TextileSlider {
  constructor(sliderSelector, options = {}) {
    this.slider = document.querySelector(sliderSelector);
    if (!this.slider) return;
    
    this.slides = this.slider.querySelectorAll('.slide');
    if (!this.slides.length) return;
    
    // Default options
    this.options = {
      autoplay: true,
      interval: 5000, // 5 seconds
      transitionDuration: 500, // 0.5 seconds
      ...options
    };
    
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.autoplayInterval = null;
    
    this.init();
  }
  
  init() {
    // Create navigation dots
    this.createNavDots();
    
    // Set up initial state
    this.slides.forEach((slide, index) => {
      slide.style.transition = `opacity ${this.options.transitionDuration}ms ease-in-out`;
      slide.style.opacity = index === 0 ? '1' : '0';
      slide.style.zIndex = index === 0 ? '1' : '0';
    });
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start autoplay if enabled
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }
  
  createNavDots() {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots absolute bottom-4 left-0 right-0 flex justify-center space-x-2';
    
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot w-3 h-3 rounded-full transition-all duration-300 ${index === 0 ? 'bg-white scale-125' : 'bg-white/50'}`;
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    this.slider.appendChild(dotsContainer);
    this.dots = dotsContainer.querySelectorAll('.slider-dot');
  }
  
  setupEventListeners() {
    // Touch events for swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    this.slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
    
    // Pause autoplay on hover
    this.slider.addEventListener('mouseenter', () => {
      if (this.options.autoplay) {
        this.stopAutoplay();
      }
    });
    
    this.slider.addEventListener('mouseleave', () => {
      if (this.options.autoplay) {
        this.startAutoplay();
      }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.isElementInViewport(this.slider)) {
        if (e.key === 'ArrowLeft') {
          this.prevSlide();
        } else if (e.key === 'ArrowRight') {
          this.nextSlide();
        }
      }
    });
    
    // Create prev/next buttons
    this.createNavButtons();
  }
  
  createNavButtons() {
    const prevButton = document.createElement('button');
    prevButton.className = 'slider-nav-btn prev absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300';
    prevButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>';
    prevButton.setAttribute('aria-label', 'Previous slide');
    prevButton.addEventListener('click', () => this.prevSlide());
    
    const nextButton = document.createElement('button');
    nextButton.className = 'slider-nav-btn next absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300';
    nextButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';
    nextButton.setAttribute('aria-label', 'Next slide');
    nextButton.addEventListener('click', () => this.nextSlide());
    
    this.slider.appendChild(prevButton);
    this.slider.appendChild(nextButton);
  }
  
  handleSwipe(startX, endX) {
    const threshold = 50; // Minimum distance to be considered a swipe
    const diff = startX - endX;
    
    if (Math.abs(diff) >= threshold) {
      if (diff > 0) {
        // Swipe left, go to next slide
        this.nextSlide();
      } else {
        // Swipe right, go to previous slide
        this.prevSlide();
      }
    }
  }
  
  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.options.interval);
  }
  
  stopAutoplay() {
    clearInterval(this.autoplayInterval);
  }
  
  nextSlide() {
    if (this.isTransitioning) return;
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }
  
  prevSlide() {
    if (this.isTransitioning) return;
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }
  
  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    
    this.isTransitioning = true;
    
    // Update dots
    this.dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('bg-white', 'scale-125');
        dot.classList.remove('bg-white/50');
      } else {
        dot.classList.remove('bg-white', 'scale-125');
        dot.classList.add('bg-white/50');
      }
    });
    
    // Hide current slide
    const currentSlide = this.slides[this.currentIndex];
    currentSlide.style.opacity = '0';
    currentSlide.style.zIndex = '0';
    
    // Show new slide
    const newSlide = this.slides[index];
    newSlide.style.opacity = '1';
    newSlide.style.zIndex = '1';
    
    // Update current index
    this.currentIndex = index;
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, this.options.transitionDuration);
  }
  
  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Hero slider
  new TextileSlider('.hero-slider', {
    autoplay: true,
    interval: 6000
  });
  
  // Testimonial slider
  new TextileSlider('.testimonial-slider', {
    autoplay: true,
    interval: 8000
  });
  
  // Related products slider
  if (document.querySelector('.related-products-slider')) {
    initRelatedProductsSlider();
  }
});

// Horizontal scrollable related products
function initRelatedProductsSlider() {
  const slider = document.querySelector('.related-products-slider');
  const sliderContainer = slider.querySelector('.slider-container');
  const prevBtn = slider.querySelector('.prev-btn');
  const nextBtn = slider.querySelector('.next-btn');
  
  if (!sliderContainer || !prevBtn || !nextBtn) return;
  
  const scrollAmount = sliderContainer.offsetWidth * 0.8;
  
  prevBtn.addEventListener('click', () => {
    sliderContainer.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });
  
  nextBtn.addEventListener('click', () => {
    sliderContainer.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });
  
  // Update button states based on scroll position
  sliderContainer.addEventListener('scroll', updateButtonStates);
  window.addEventListener('resize', updateButtonStates);
  
  // Initial button state
  updateButtonStates();
  
  function updateButtonStates() {
    const isAtStart = sliderContainer.scrollLeft <= 10;
    const isAtEnd = sliderContainer.scrollLeft + sliderContainer.offsetWidth >= sliderContainer.scrollWidth - 10;
    
    prevBtn.classList.toggle('opacity-50', isAtStart);
    prevBtn.classList.toggle('cursor-not-allowed', isAtStart);
    prevBtn.disabled = isAtStart;
    
    nextBtn.classList.toggle('opacity-50', isAtEnd);
    nextBtn.classList.toggle('cursor-not-allowed', isAtEnd);
    nextBtn.disabled = isAtEnd;
  }
}