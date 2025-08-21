// Event Bus for Component Communication
export class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  off(event, callback) {
    if (!this.events[event]) return;
    
    const index = this.events[event].indexOf(callback);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }
  
  emit(event, data) {
    console.log(`EventBus: Emitting ${event} with data:`, data);
    
    if (!this.events[event]) {
      console.warn(`EventBus: No listeners for event ${event}`);
      return;
    }
    
    console.log(`EventBus: Found ${this.events[event].length} listeners for ${event}`);
    
    this.events[event].forEach((callback, index) => {
      try {
        console.log(`EventBus: Calling listener ${index} for ${event}`);
        callback(data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }
  
  once(event, callback) {
    const onceCallback = (data) => {
      callback(data);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }
  
  clear() {
    this.events = {};
  }
}

// Global event bus instance
export const globalEventBus = new EventBus();
