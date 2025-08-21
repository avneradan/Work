// Cursor Manager Component
import { ANIMATION_CONFIG, SELECTORS } from '../config/animation-config.js';
import { DOMUtils } from '../utils/dom-utils.js';
import { globalEventBus } from '../utils/event-bus.js';

export class CursorManager {
  constructor() {
    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.cursorLargeX = 0;
    this.cursorLargeY = 0;
    this.firstMove = true;
    this.isActive = false;
    
    this.elements = {};
    this.animationId = null;
    
    this.init();
  }
  
  init() {
    this.setupElements();
    this.hideNativeCursor();
    this.setupEventListeners();
    this.startAnimation();
  }
  
  setupElements() {
    this.elements.cursor = DOMUtils.querySelector(SELECTORS.cursor.cursor);
    this.elements.largeCursor = DOMUtils.querySelector(SELECTORS.cursor.largeCursor);
    this.elements.container = DOMUtils.querySelector(SELECTORS.cursor.container);
    
    if (!this.elements.cursor || !this.elements.largeCursor || !this.elements.container) {
      console.warn('Cursor elements not found');
      return;
    }
    
    this.isActive = true;
  }
  
  hideNativeCursor() {
    // Apply to body and all elements
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';
    
    // Also apply to all existing and future elements
    const style = document.createElement('style');
    style.textContent = `
      * { cursor: none !important; }
      html, body { cursor: none !important; }
    `;
    document.head.appendChild(style);
  }
  
  setupEventListeners() {
    if (!this.isActive) return;
    
    // Hide cursor on various events
    window.addEventListener('focus', () => this.hideNativeCursor());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.hideNativeCursor();
      }
    });
    window.addEventListener('pointerenter', () => this.hideNativeCursor());
    
    // Track pointer movement
    window.addEventListener('pointermove', this.handlePointerMove.bind(this), { passive: true });
    
    // Handle window events
    window.addEventListener('pointerleave', this.handlePointerLeave.bind(this));
    window.addEventListener('focus', this.handleWindowFocus.bind(this));
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.addEventListener('pointerenter', this.handlePointerEnter.bind(this));
  }
  
  handlePointerMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    
    if (this.firstMove) {
      this.firstMove = false;
      this.snapTo(this.mouseX, this.mouseY);
    }
    
    DOMUtils.setStyle(this.elements.container, 'opacity', '1');
    this.hideNativeCursor();
  }
  
  handlePointerLeave() {
    DOMUtils.setStyle(this.elements.container, 'opacity', '0');
  }
  
  handleWindowFocus() {
    this.reenter();
  }
  
  handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      this.reenter();
    }
  }
  
  handlePointerEnter(e) {
    this.reenter();
    if (e.clientX || e.clientY) {
      this.snapTo(e.clientX, e.clientY);
    }
  }
  
  snapTo(x, y) {
    this.cursorX = x;
    this.cursorY = y;
    this.cursorLargeX = x;
    this.cursorLargeY = y;
    
    this.updateCursorPosition();
  }
  
  updateCursorPosition() {
    const { cursorOffset, largeCursorOffset } = ANIMATION_CONFIG.cursor;
    
    DOMUtils.setStyle(this.elements.cursor, 'transform', 
      `translate(${this.cursorX - cursorOffset}px, ${this.cursorY - cursorOffset}px)`);
    
    DOMUtils.setStyle(this.elements.largeCursor, 'transform', 
      `translate(${this.cursorLargeX - largeCursorOffset}px, ${this.cursorLargeY - largeCursorOffset}px)`);
  }
  
  startAnimation() {
    if (!this.isActive) return;
    
    const animate = () => {
      if (!this.isActive) return;
      
      this.updateCursorPosition();
      this.animateCursor();
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  animateCursor() {
    const { followSpeed, largeCursorLag } = ANIMATION_CONFIG.cursor;
    
    // Smooth follow for main cursor
    this.cursorX += (this.mouseX - this.cursorX) * followSpeed;
    this.cursorY += (this.mouseY - this.cursorY) * followSpeed;
    
    // Lagged follow for large cursor
    this.cursorLargeX += (this.mouseX - this.cursorLargeX) * (followSpeed * largeCursorLag);
    this.cursorLargeY += (this.mouseY - this.cursorLargeY) * (followSpeed * largeCursorLag);
  }
  
  reenter() {
    DOMUtils.setStyle(this.elements.container, 'opacity', '1');
    
    if (this.firstMove) {
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      this.snapTo(x, y);
    }
  }
  
  destroy() {
    this.isActive = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // Remove event listeners
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerleave', this.handlePointerLeave);
    window.removeEventListener('focus', this.handleWindowFocus);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('pointerenter', this.handlePointerEnter);
  }
}
