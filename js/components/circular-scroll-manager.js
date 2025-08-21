// Circular Scroll Manager Component
import { ANIMATION_CONFIG, SELECTORS } from '../config/animation-config.js';
import { DOMUtils } from '../utils/dom-utils.js';
import { globalEventBus } from '../utils/event-bus.js';

export class CircularScrollManager {
  constructor() {
    this.currentRotation = 0;
    this.targetRotation = 0;
    this.isAnimating = false;
    
    // Touch variables for mobile
    this.isTouchDevice = 'ontouchstart' in window;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartRotation = 0;
    this.isTouching = false;
    
    // Drag variables
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartRotation = 0;
    
    this.elements = {};
    this.animationId = null;
    
    this.init();
  }
  
  init() {
    this.setupElements();
    this.setupEventListeners();
    this.startAnimation();
  }
  
  setupElements() {
    this.elements.container = DOMUtils.querySelector(SELECTORS.circularScroll.container);
    this.elements.circle = DOMUtils.querySelector(SELECTORS.circularScroll.circle);
    this.elements.pin = DOMUtils.querySelector(SELECTORS.circularScroll.pin);
    this.elements.items = DOMUtils.querySelectorAll(SELECTORS.circularScroll.items);
    
    if (!this.elements.container || !this.elements.circle || !this.elements.pin) {
      console.warn('Circular scroll elements not found');
      return;
    }
    
    this.setupItemClickHandlers();
  }
  
  setupEventListeners() {
    this.setupWheelListener();
    this.setupMouseListener();
    this.setupTouchListener();
    this.setupResizeListener();
  }
  
  setupWheelListener() {
    DOMUtils.addEventListener(this.elements.container, 'wheel', this.handleWheel.bind(this), { passive: false });
  }
  
  setupMouseListener() {
    DOMUtils.addEventListener(this.elements.container, 'mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
    // Set initial cursor
    DOMUtils.setStyle(this.elements.container, 'cursor', 'grab');
  }
  
  setupTouchListener() {
    if (!this.isTouchDevice) return;
    
    DOMUtils.addEventListener(this.elements.container, 'touchstart', this.handleTouchStart.bind(this), { passive: true });
    DOMUtils.addEventListener(this.elements.container, 'touchmove', this.handleTouchMove.bind(this), { passive: false });
    DOMUtils.addEventListener(this.elements.container, 'touchend', this.handleTouchEnd.bind(this), { passive: true });
  }
  
  setupResizeListener() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  setupItemClickHandlers() {
    this.elements.items.forEach((img, idx) => {
      DOMUtils.setStyle(img, 'cursor', 'pointer');
      DOMUtils.addEventListener(img, 'click', () => this.handleItemClick(img, idx));
    });
  }
  
  handleWheel(e) {
    e.preventDefault();
    
    const { wheelSensitivity, maxRotation } = ANIMATION_CONFIG.circularScroll;
    const delta = e.deltaY * wheelSensitivity;
    
    this.targetRotation += delta;
    this.normalizeRotation();
    this.isAnimating = true;
  }
  
  handleMouseDown(e) {
    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartRotation = this.targetRotation;
    DOMUtils.setStyle(this.elements.container, 'cursor', 'grabbing');
    e.preventDefault();
  }
  
  handleMouseMove(e) {
    if (!this.isDragging) return;
    
    const { dragSensitivity } = ANIMATION_CONFIG.circularScroll;
    const deltaX = e.clientX - this.dragStartX;
    const rotationDelta = deltaX * dragSensitivity;
    
    this.targetRotation = this.dragStartRotation + rotationDelta;
    this.normalizeRotation();
    this.isAnimating = true;
  }
  
  handleMouseUp() {
    this.isDragging = false;
    DOMUtils.setStyle(this.elements.container, 'cursor', 'grab');
  }
  
  handleTouchStart(e) {
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartRotation = this.targetRotation;
    this.isTouching = true;
  }
  
  handleTouchMove(e) {
    if (!this.isTouching) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    
    const { touchThreshold, touchSensitivity } = ANIMATION_CONFIG.circularScroll;
    
    // Determine if this is a horizontal swipe (rotation) or vertical scroll
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > touchThreshold) {
      // Horizontal swipe - rotate the circle
      e.preventDefault();
      const rotationDelta = deltaX * touchSensitivity;
      this.targetRotation = this.touchStartRotation + rotationDelta;
      this.normalizeRotation();
      this.isAnimating = true;
    }
    // If vertical scroll, let the browser handle it naturally
  }
  
  handleTouchEnd() {
    this.isTouching = false;
  }
  
  handleResize() {
    // Reset rotation on resize to maintain visual consistency
    this.currentRotation = 0;
    this.targetRotation = 0;
    DOMUtils.setStyle(this.elements.circle, 'transform', 'rotate(0deg)');
  }
  
  handleItemClick(img, idx) {
    console.log('Item clicked:', img.src, img.alt, idx);
    
    // Emit event for drawer manager
    globalEventBus.emit('itemSelected', {
      src: img.src,
      alt: img.alt || `Item ${idx + 1}`,
      caption: img.alt || `Item ${idx + 1}`
    });
    
    console.log('Emitted itemSelected event');
  }
  
  normalizeRotation() {
    const { maxRotation } = ANIMATION_CONFIG.circularScroll;
    
    if (this.targetRotation > maxRotation) {
      this.targetRotation -= maxRotation;
    } else if (this.targetRotation < -maxRotation) {
      this.targetRotation += maxRotation;
    }
  }
  
  startAnimation() {
    const animate = () => {
      this.updateRotation();
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  updateRotation() {
    if (!this.isAnimating) return;
    
    const { rotationSpeed } = ANIMATION_CONFIG.circularScroll;
    const diff = this.targetRotation - this.currentRotation;
    
    if (Math.abs(diff) > 0.1) {
      this.currentRotation += diff * rotationSpeed;
      DOMUtils.setStyle(this.elements.circle, 'transform', `rotate(${this.currentRotation}deg)`);
    } else {
      this.currentRotation = this.targetRotation;
      this.isAnimating = false;
    }
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // Remove event listeners
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('resize', this.handleResize);
  }
}
