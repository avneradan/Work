// Horizontal Gallery Manager Component
import { ANIMATION_CONFIG } from '../config/animation-config.js';
import { DOMUtils } from '../utils/dom-utils.js';
import { globalEventBus } from '../utils/event-bus.js';

export class HorizontalGalleryManager {
  constructor() {
    this.isActive = false;
    this.elements = {};
    this.animationId = null;
    this.scrollSpeed = ANIMATION_CONFIG.horizontalGallery.scrollSpeed;
    this.currentScrollX = 0;
    this.trackWidth = 0;
    this.itemWidth = 0;
    this.gap = ANIMATION_CONFIG.horizontalGallery.gap;
    
    this.init();
  }
  
  init() {
    this.setupElements();
    this.setupEventListeners();
    this.calculateDimensions();
    this.startAnimation();
  }
  
  setupElements() {
    this.elements.track = DOMUtils.querySelector('.gallery-track');
    this.elements.items = DOMUtils.querySelectorAll('.gallery-item');
    
    if (!this.elements.track || this.elements.items.length === 0) {
      console.warn('Horizontal gallery elements not found');
      return;
    }
    
    this.isActive = true;
  }
  
  setupEventListeners() {
    // Pause animation on hover (if enabled in config)
    if (this.elements.track && ANIMATION_CONFIG.horizontalGallery.pauseOnHover) {
      DOMUtils.addEventListener(this.elements.track, 'mouseenter', this.pauseAnimation.bind(this));
      DOMUtils.addEventListener(this.elements.track, 'mouseleave', this.resumeAnimation.bind(this));
    }
    
    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Listen for drawer events to pause/resume
    globalEventBus.on('drawerOpened', this.handleDrawerOpened.bind(this));
    globalEventBus.on('drawerClosed', this.handleDrawerClosed.bind(this));
  }
  
  calculateDimensions() {
    if (!this.elements.track || this.elements.items.length === 0) return;
    
    // Calculate item width including gap
    const firstItem = this.elements.items[0];
    if (firstItem) {
      const itemRect = firstItem.getBoundingClientRect();
      this.itemWidth = itemRect.width + this.gap;
    }
    
    // Calculate total track width
    this.trackWidth = this.elements.items.length * this.itemWidth;
    
    // Reset scroll position
    this.currentScrollX = 0;
  }
  
  startAnimation() {
    if (!this.isActive) return;
    
    const animate = () => {
      if (!this.isActive) return;
      
      this.updateScroll();
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  updateScroll() {
    if (!this.elements.track) return;
    
    // Update scroll position
    this.currentScrollX -= this.scrollSpeed;
    
    // Reset position when we've scrolled one full set of items
    const resetPoint = this.trackWidth / 2;
    if (Math.abs(this.currentScrollX) >= resetPoint) {
      this.currentScrollX = 0;
    }
    
    // Apply transform
    DOMUtils.setStyle(this.elements.track, 'transform', `translateX(${this.currentScrollX}px)`);
  }
  
  pauseAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  resumeAnimation() {
    if (!this.animationId && this.isActive) {
      this.startAnimation();
    }
  }
  
  handleResize() {
    this.calculateDimensions();
  }
  
  handleDrawerOpened() {
    // Pause animation when drawer is open
    this.pauseAnimation();
  }
  
  handleDrawerClosed() {
    // Resume animation when drawer is closed
    this.resumeAnimation();
  }
  
  setScrollSpeed(speed) {
    this.scrollSpeed = speed;
  }
  
  destroy() {
    this.isActive = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    globalEventBus.off('drawerOpened', this.handleDrawerOpened);
    globalEventBus.off('drawerClosed', this.handleDrawerClosed);
  }
}
