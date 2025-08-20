// 3D Carousel functionality
class Carousel3D {
  constructor() {
    this.carouselTrack = document.querySelector('.carousel-track');
    this.carouselItems = document.querySelectorAll('.carousel-item');
    this.totalItems = this.carouselItems.length;
    this.currentRotation = 0;
    this.targetRotation = 0;
    this.isScrolling = false;
    this.scrollTimeout;
    
    this.init();
  }
  
  init() {
    this.setupScrollListener();
    this.animate();
    this.addPlaceholderText();
  }
  
  setupScrollListener() {
    let lastScrollTop = 0;
    let ticking = false;
    
    const updateCarousel = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const carouselSection = document.querySelector('.carousel-section');
      const carouselRect = carouselSection.getBoundingClientRect();
      
      // Only animate when carousel is in view
      if (carouselRect.top < window.innerHeight && carouselRect.bottom > 0) {
        const progress = Math.max(0, Math.min(1, 
          (window.innerHeight - carouselRect.top) / (window.innerHeight + carouselRect.height)
        ));
        
        // Calculate rotation based on scroll progress
        this.targetRotation = progress * 360;
        
        // Add some momentum to the rotation
        this.currentRotation += (this.targetRotation - this.currentRotation) * 0.05;
        
        this.updateCarouselRotation();
      }
      
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateCarousel);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestTick, { passive: true });
  }
  
  updateCarouselRotation() {
    if (this.carouselTrack) {
      this.carouselTrack.style.transform = `translate(-50%, -50%) rotateY(${this.currentRotation}deg)`;
    }
  }
  
  animate() {
    // Continuous subtle rotation for visual interest
    this.currentRotation += 0.1;
    this.updateCarouselRotation();
    
    requestAnimationFrame(() => this.animate());
  }
  
  addPlaceholderText() {
    // Add placeholder text to each carousel item
    this.carouselItems.forEach((item, index) => {
      const placeholder = item.querySelector('.carousel-placeholder');
      if (placeholder) {
        placeholder.textContent = `Project ${index + 1}`;
      }
    });
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Carousel3D();
});
