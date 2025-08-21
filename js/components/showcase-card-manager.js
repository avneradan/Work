// Showcase Card Manager Component
import { DOMUtils } from '../utils/dom-utils.js';

export class ShowcaseCardManager {
  constructor() {
    this.cards = [];
    this.init();
  }
  
  init() {
    this.setupCards();
  }
  
  setupCards() {
    const cardElements = DOMUtils.querySelectorAll('.showcase-card');
    
    cardElements.forEach(cardElement => {
      const card = new ShowcaseCard(cardElement);
      this.cards.push(card);
    });
  }
  
  destroy() {
    this.cards.forEach(card => card.destroy());
    this.cards = [];
  }
}

// Individual Showcase Card Class
class ShowcaseCard {
  constructor(element) {
    this.element = element;
    this.dragStartX = 0;
    this.dragX = 0;
    this.velocity = 0;
    this.isDragging = false;
    this.animationId = null;
    
    this.config = {
      maxTilt: 12,
      dragThreshold: 100
    };
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    DOMUtils.addEventListener(this.element, 'mousedown', this.handleMouseDown.bind(this));
    DOMUtils.addEventListener(this.element, 'mousemove', this.handleMouseMove.bind(this));
    DOMUtils.addEventListener(this.element, 'mouseup', this.handleMouseUp.bind(this));
    DOMUtils.addEventListener(this.element, 'mouseleave', this.handleMouseLeave.bind(this));
  }
  
  handleMouseDown(e) {
    this.dragStartX = e.clientX;
    this.dragX = 0;
    this.isDragging = true;
    this.velocity = 0;
    
    this.stopAnimation();
    DOMUtils.setStyle(this.element, 'transition', 'none');
    this.startAnimation();
  }
  
  handleMouseMove(e) {
    if (!this.isDragging) return;
    
    const deltaX = e.clientX - this.dragStartX;
    this.velocity = deltaX - this.dragX;
    this.dragX = deltaX;
  }
  
  handleMouseUp() {
    this.endDrag();
  }
  
  handleMouseLeave() {
    if (this.isDragging) {
      this.endDrag();
    }
  }
  
  startAnimation() {
    const animate = () => {
      if (!this.isDragging) return;
      
      this.updateTransform();
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  updateTransform() {
    const { maxTilt } = this.config;
    const rotate = Math.min(Math.abs(this.dragX) / 5, maxTilt) * Math.sign(this.dragX);
    
    DOMUtils.setStyle(this.element, 'transform', `rotateZ(${rotate}deg)`);
  }
  
  reset() {
    DOMUtils.setStyle(this.element, 'transition', 'transform 0.4s ease');
    DOMUtils.setStyle(this.element, 'transform', 'rotateZ(0deg)');
  }
  
  flyAway(direction) {
    DOMUtils.setStyle(this.element, 'transition', 'transform 0.6s ease, opacity 0.6s ease');
    DOMUtils.setStyle(this.element, 'transform', `translateX(${direction * 1000}px) rotateZ(${direction * 24}deg)`);
    DOMUtils.setStyle(this.element, 'opacity', '0');
    
    setTimeout(() => {
      DOMUtils.setStyle(this.element, 'transition', 'none');
      DOMUtils.setStyle(this.element, 'transform', 'translateX(0) rotateZ(0deg)');
      DOMUtils.setStyle(this.element, 'opacity', '0');
      
      requestAnimationFrame(() => {
        DOMUtils.setStyle(this.element, 'transition', 'opacity 0.6s ease');
        DOMUtils.setStyle(this.element, 'opacity', '1');
      });
    }, 600);
  }
  
  endDrag() {
    this.stopAnimation();
    DOMUtils.setStyle(this.element, 'transition', 'transform 0.3s ease');
    
    if (Math.abs(this.dragX) < this.config.dragThreshold) {
      this.reset();
    } else {
      this.flyAway(Math.sign(this.dragX));
    }
    
    this.isDragging = false;
  }
  
  destroy() {
    this.stopAnimation();
    
    // Remove event listeners
    DOMUtils.removeEventListener(this.element, 'mousedown', this.handleMouseDown);
    DOMUtils.removeEventListener(this.element, 'mousemove', this.handleMouseMove);
    DOMUtils.removeEventListener(this.element, 'mouseup', this.handleMouseUp);
    DOMUtils.removeEventListener(this.element, 'mouseleave', this.handleMouseLeave);
  }
}
