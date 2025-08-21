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
    
    console.log('Gallery track found:', this.elements.track);
    console.log('Gallery items found:', this.elements.items.length);
    
    if (!this.elements.track || this.elements.items.length === 0) {
      console.warn('Horizontal gallery elements not found');
      return;
    }
    
    // Check if images are loading properly
    this.elements.items.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) {
        console.log(`Item ${index}:`, img.src, img.alt);
        
        // Add error handling for images
        img.addEventListener('error', () => {
          console.error(`Failed to load image: ${img.src}`);
        });
        
        img.addEventListener('load', () => {
          console.log(`Successfully loaded image: ${img.src}`);
        });
      }
    });
    
    this.isActive = true;
  }
  
  setupEventListeners() {
    // Animation disabled - no hover pause needed
    
    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Listen for drawer events (but no need to pause/resume animation)
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
    // Animation disabled - gallery will remain static
    if (!this.isActive) return;
    
    // No animation loop needed
    console.log('Gallery animation disabled - gallery remains static');
  }
  
  updateScroll() {
    // Animation disabled - no scroll updates needed
    if (!this.elements.track) return;
    
    // Keep gallery at original position with proper padding
    DOMUtils.setStyle(this.elements.track, 'transform', 'translateX(0px)');
  }
  
  pauseAnimation() {
    // Animation disabled - no need to pause
    console.log('Animation pause called but animation is disabled');
  }
  
  resumeAnimation() {
    // Animation disabled - no need to resume
    console.log('Animation resume called but animation is disabled');
  }
  
  handleResize() {
    this.calculateDimensions();
  }
  
  handleDrawerOpened() {
    // Center the first image when drawer opens
    this.centerFirstImage();
    console.log('Drawer opened - gallery centered on first image');
  }
  
  handleDrawerClosed() {
    // Animation disabled - no need to resume
    console.log('Drawer closed - gallery remains static');
  }
  
  setScrollSpeed(speed) {
    this.scrollSpeed = speed;
  }
  
  centerFirstImage() {
    if (!this.elements.track || !this.elements.items.length) return;
    
    // Calculate the center position for the first image
    const container = this.elements.track.parentElement;
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    const firstItem = this.elements.items[0];
    const itemWidth = firstItem.offsetWidth;
    const gap = parseInt(getComputedStyle(this.elements.track).gap) || 16;
    
    // Calculate scroll position to center the first image
    // Account for the left padding (50% of container width)
    const leftPadding = containerWidth * 0.5;
    const scrollPosition = leftPadding - (containerWidth - itemWidth) / 2;
    
    // Smooth scroll to center position
    container.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: 'smooth'
    });
  }
  
  destroy() {
    this.isActive = false;
    
    // No animation to clean up
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    globalEventBus.off('drawerOpened', this.handleDrawerOpened);
    globalEventBus.off('drawerClosed', this.handleDrawerClosed);
  }
}
