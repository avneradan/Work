// Circular Scroll Effect - Viewport Only
class CircularScrollEffect {
  constructor() {
    this.container = document.querySelector('.circular-scroll-container');
    this.circle = document.querySelector('.circular-scroll-circle');
    this.pin = document.querySelector('.circular-scroll-pin');
    
    this.currentRotation = 0;
    this.targetRotation = 0;
    this.isAnimating = false;
    
    this.init();
  }
  
  init() {
    if (!this.container || !this.circle || !this.pin) {
      console.warn('Circular scroll elements not found');
      return;
    }
    
    this.setupWheelListener();
    this.setupMouseMoveListener();
    this.setupResizeListener();
    this.animate();
  }
  
  setupWheelListener() {
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      // Calculate rotation based on wheel delta
      const delta = e.deltaY * 0.5; // Adjust sensitivity
      this.targetRotation += delta;
      
      // Keep rotation within bounds
      if (this.targetRotation > 360) {
        this.targetRotation -= 360;
      } else if (this.targetRotation < -360) {
        this.targetRotation += 360;
      }
      
      this.isAnimating = true;
    }, { passive: false });
  }
  
  setupMouseMoveListener() {
    let isDragging = false;
    let startX = 0;
    let startRotation = 0;
    
    this.container.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startRotation = this.targetRotation;
      this.container.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const rotationDelta = deltaX * 0.5; // Adjust sensitivity
      this.targetRotation = startRotation + rotationDelta;
      this.isAnimating = true;
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
      this.container.style.cursor = 'grab';
    });
    
    // Set initial cursor
    this.container.style.cursor = 'grab';
  }
  
  setupResizeListener() {
    window.addEventListener('resize', () => {
      // Reset rotation on resize to maintain visual consistency
      this.currentRotation = 0;
      this.targetRotation = 0;
      this.circle.style.transform = `rotate(0deg)`;
    });
  }
  
  animate() {
    if (this.isAnimating) {
      // Smooth interpolation between current and target rotation
      const diff = this.targetRotation - this.currentRotation;
      
      if (Math.abs(diff) > 0.1) {
        this.currentRotation += diff * 0.1; // Adjust smoothness
        this.circle.style.transform = `rotate(${this.currentRotation}deg)`;
      } else {
        this.currentRotation = this.targetRotation;
        this.isAnimating = false;
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CircularScrollEffect();
});
