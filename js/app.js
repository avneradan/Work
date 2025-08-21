// Main Application Controller
import { CursorManager } from './components/cursor-manager.js';
import { DrawerManager } from './components/drawer-manager.js';
import { CircularScrollManager } from './components/circular-scroll-manager.js';
import { ShowcaseCardManager } from './components/showcase-card-manager.js';
import { HorizontalGalleryManager } from './components/horizontal-gallery-manager.js';
import { globalEventBus } from './utils/event-bus.js';

export class App {
  constructor() {
    this.components = {};
    this.isInitialized = false;
    
    this.init();
  }
  
  init() {
    try {
      this.initializeComponents();
      this.setupGlobalEventHandlers();
      this.isInitialized = true;
      
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }
  
  initializeComponents() {
    // Initialize components in dependency order
    this.components.cursor = new CursorManager();
    this.components.drawer = new DrawerManager();
    this.components.circularScroll = new CircularScrollManager();
    this.components.showcaseCards = new ShowcaseCardManager();
    this.components.horizontalGallery = new HorizontalGalleryManager();
  }
  
  setupGlobalEventHandlers() {
    // Listen for global events that might affect multiple components
    globalEventBus.on('drawerOpened', this.handleDrawerOpened.bind(this));
    globalEventBus.on('drawerClosed', this.handleDrawerClosed.bind(this));
    
    // Handle window events
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    window.addEventListener('resize', this.handleWindowResize.bind(this));
  }
  
  handleDrawerOpened() {
    // Pause circular scroll when drawer is open
    if (this.components.circularScroll) {
      // Could add pause functionality here if needed
    }
  }
  
  handleDrawerClosed() {
    // Resume circular scroll when drawer is closed
    if (this.components.circularScroll) {
      // Could add resume functionality here if needed
    }
  }
  
  handleBeforeUnload() {
    this.destroy();
  }
  
  handleWindowResize() {
    // Notify components about resize
    globalEventBus.emit('windowResized');
  }
  
  getComponent(name) {
    return this.components[name];
  }
  
  destroy() {
    // Destroy all components in reverse order
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    
    // Clear global event bus
    globalEventBus.clear();
    
    // Remove window event listeners
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('resize', this.handleWindowResize);
    
    this.components = {};
    this.isInitialized = false;
    
    console.log('App destroyed');
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
