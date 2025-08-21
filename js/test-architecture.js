// Architecture Test File
// This file tests the basic functionality of the new architecture

import { App } from './app.js';
import { globalEventBus } from './utils/event-bus.js';

// Test function to verify architecture
export function testArchitecture() {
  console.log('🧪 Testing new architecture...');
  
  // Test 1: Event Bus
  let eventReceived = false;
  globalEventBus.on('testEvent', (data) => {
    eventReceived = true;
    console.log('✅ Event bus working:', data);
  });
  
  globalEventBus.emit('testEvent', { message: 'Hello from event bus!' });
  
  if (!eventReceived) {
    console.error('❌ Event bus test failed');
    return false;
  }
  
  // Test 2: App Initialization
  try {
    const app = new App();
    
    if (!app.isInitialized) {
      console.error('❌ App initialization failed');
      return false;
    }
    
    console.log('✅ App initialized successfully');
    
    // Test 3: Component Access
    const cursorComponent = app.getComponent('cursor');
    const drawerComponent = app.getComponent('drawer');
    
    if (!cursorComponent || !drawerComponent) {
      console.error('❌ Component access failed');
      return false;
    }
    
    console.log('✅ Component access working');
    
    // Cleanup
    app.destroy();
    console.log('✅ App cleanup working');
    
    return true;
    
  } catch (error) {
    console.error('❌ Architecture test failed:', error);
    return false;
  }
}

// Run test if this file is loaded directly
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(testArchitecture, 1000); // Give components time to initialize
    });
  } else {
    setTimeout(testArchitecture, 1000);
  }
}
