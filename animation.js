// Circular Scroll Effect - Viewport Only
class CircularScrollEffect {
  constructor() {
    this.container = document.querySelector('.circular-scroll-container');
    this.circle = document.querySelector('.circular-scroll-circle');
    this.pin = document.querySelector('.circular-scroll-pin');
    
    this.currentRotation = 0;
    this.targetRotation = 0;
    this.isAnimating = false;
    this.rotationSpeed = 0.02; // Adjust for smoother/faster animation
    
    // Touch variables for mobile
    this.isTouchDevice = 'ontouchstart' in window;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartRotation = 0;
    this.isTouching = false;
    
    this.init();
  }
  
  init() {
    if (!this.container || !this.circle || !this.pin) {
      console.warn('Circular scroll elements not found');
      return;
    }
    
    this.setupWheelListener();
    this.setupMouseMoveListener();
    this.setupTouchListener();
    this.setupResizeListener();
    this.animate();
  }
  
  setupWheelListener() {
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      // Calculate rotation based on wheel delta with better sensitivity
      const delta = e.deltaY * 0.04; // Reduced sensitivity for more control
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
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const rotationDelta = deltaX * 0.4; // Better sensitivity for dragging
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
  
  setupTouchListener() {
    if (!this.isTouchDevice) return;
    
    this.container.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.touchStartRotation = this.targetRotation;
      this.isTouching = true;
    }, { passive: true });
    
    this.container.addEventListener('touchmove', (e) => {
      if (!this.isTouching) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;
      
      // Determine if this is a horizontal swipe (rotation) or vertical scroll
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
        // Horizontal swipe - rotate the circle
        e.preventDefault();
        const rotationDelta = deltaX * 0.3;
        this.targetRotation = this.touchStartRotation + rotationDelta;
        this.isAnimating = true;
      }
      // If vertical scroll, let the browser handle it naturally
    }, { passive: false });
    
    this.container.addEventListener('touchend', () => {
      this.isTouching = false;
    }, { passive: true });
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
        this.currentRotation += diff * this.rotationSpeed;
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
