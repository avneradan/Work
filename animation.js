// Circular Scroll Effect
class CircularScrollEffect {
  constructor() {
    this.container = document.querySelector('.circular-scroll-container');
    this.circle = document.querySelector('.circular-scroll-circle');
    this.pin = document.querySelector('.circular-scroll-pin');
    
    this.init();
  }
  
  init() {
    if (!this.container || !this.circle || !this.pin) {
      console.warn('Circular scroll elements not found');
      return;
    }
    
    this.setupScrollListener();
    this.setupResizeListener();
  }
  
  setupScrollListener() {
    window.addEventListener('scroll', () => {
      this.updateRotation();
    });
  }
  
  setupResizeListener() {
    window.addEventListener('resize', () => {
      this.updateRotation();
    });
  }
  
  updateRotation() {
    const scrollTop = window.pageYOffset;
    const containerTop = this.container.offsetTop;
    const containerHeight = this.container.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // Calculate scroll progress within the container
    const scrollProgress = Math.max(0, Math.min(1, 
      (scrollTop - containerTop) / (containerHeight - viewportHeight)
    ));
    
    // Rotate the circle based on scroll progress
    // Full rotation (360 degrees) over the scroll distance
    const rotation = scrollProgress * 360;
    
    this.circle.style.transform = `rotate(${rotation}deg)`;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CircularScrollEffect();
});
