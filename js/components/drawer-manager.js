// Drawer Manager Component
import { SELECTORS } from '../config/animation-config.js';
import { DOMUtils } from '../utils/dom-utils.js';
import { globalEventBus } from '../utils/event-bus.js';

export class DrawerManager {
  constructor() {
    this.isOpen = false;
    this.elements = {};
    
    this.init();
  }
  
  init() {
    this.setupElements();
    this.setupEventListeners();
    this.setupGlobalEvents();
  }
  
  setupElements() {
    this.elements.root = DOMUtils.querySelector(SELECTORS.drawer.root);
    this.elements.overlay = DOMUtils.querySelector(SELECTORS.drawer.overlay);
    this.elements.panel = DOMUtils.querySelector(SELECTORS.drawer.panel);
    this.elements.closeBtn = DOMUtils.querySelector(SELECTORS.drawer.closeBtn);
    this.elements.image = DOMUtils.querySelector(SELECTORS.drawer.image);
    this.elements.caption = DOMUtils.querySelector(SELECTORS.drawer.caption);
    
    // Horizontal gallery elements
    this.elements.galleryMainImage = DOMUtils.querySelector('#gallery-main-image');
    this.elements.galleryMainImageDuplicate = DOMUtils.querySelector('#gallery-main-image-duplicate');
    
    if (!this.elements.root) {
      console.warn('Drawer root element not found');
      return;
    }
  }
  
  setupEventListeners() {
    if (this.elements.overlay) {
      DOMUtils.addEventListener(this.elements.overlay, 'click', this.close.bind(this));
    }
    
    if (this.elements.closeBtn) {
      DOMUtils.addEventListener(this.elements.closeBtn, 'click', this.close.bind(this));
    }
  }
  
  setupGlobalEvents() {
    // Listen for item selection events
    globalEventBus.on('itemSelected', this.handleItemSelection.bind(this));
    
    // Listen for escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }
  
  handleItemSelection(data) {
    this.populateDrawer(data);
    this.open();
  }
  
  populateDrawer(data) {
    console.log('Populating drawer with data:', data);
    
    if (this.elements.image && data.src) {
      this.elements.image.src = data.src;
      this.elements.image.alt = data.alt || 'Selected item';
      console.log('Set main drawer image:', data.src);
    }
    
    if (this.elements.caption && data.caption) {
      this.elements.caption.textContent = data.caption;
      console.log('Set drawer caption:', data.caption);
    }
    
    // Populate horizontal gallery with the selected image
    if (this.elements.galleryMainImage && data.src) {
      this.elements.galleryMainImage.src = data.src;
      this.elements.galleryMainImage.alt = data.alt || 'Main project image';
      console.log('Set gallery main image:', data.src);
    }
    
    if (this.elements.galleryMainImageDuplicate && data.src) {
      this.elements.galleryMainImageDuplicate.src = data.src;
      this.elements.galleryMainImageDuplicate.alt = data.alt || 'Main project image';
      console.log('Set gallery main image duplicate:', data.src);
    }
  }
  
  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    DOMUtils.setAttribute(this.elements.root, 'data-open', 'true');
    DOMUtils.setAttribute(this.elements.root, 'aria-hidden', 'false');
    
    // Emit event for other components
    globalEventBus.emit('drawerOpened');
  }
  
  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    DOMUtils.setAttribute(this.elements.root, 'data-open', 'false');
    DOMUtils.setAttribute(this.elements.root, 'aria-hidden', 'true');
    
    // Emit event for other components
    globalEventBus.emit('drawerClosed');
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  destroy() {
    // Remove global event listeners
    globalEventBus.off('itemSelected', this.handleItemSelection);
    
    // Close drawer if open
    if (this.isOpen) {
      this.close();
    }
  }
}
