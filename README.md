# Portfolio Website - Refactored Architecture

## Overview

This portfolio website has been refactored using modern architectural principles to improve maintainability, testability, and code organization while preserving the exact same user experience and visual appearance.

## Architecture Principles

### 1. Single Responsibility Principle
Each component handles one specific concern:
- **CursorManager**: Handles custom cursor behavior
- **DrawerManager**: Manages the image drawer functionality
- **CircularScrollManager**: Controls circular scroll animations
- **ShowcaseCardManager**: Manages showcase card interactions

### 2. Dependency Injection
Components receive dependencies rather than creating them:
- Configuration is injected via `animation-config.js`
- DOM utilities are injected via `dom-utils.js`
- Event communication is handled via `event-bus.js`

### 3. Event-Driven Communication
Components communicate through events, not direct calls:
- Loose coupling between components
- Easy to add/remove components without breaking others
- Testable in isolation

### 4. Configuration-Driven
All animation parameters are centralized and easily adjustable:
- Sensitivity settings
- Animation speeds
- Threshold values
- DOM selectors

## File Structure

```
js/
├── app.js                    # Main application controller
├── config/
│   └── animation-config.js  # Centralized configuration
├── components/
│   ├── cursor-manager.js    # Custom cursor functionality
│   ├── drawer-manager.js    # Drawer management
│   ├── circular-scroll-manager.js  # Circular scroll effects
│   └── showcase-card-manager.js    # Showcase card interactions
└── utils/
    ├── dom-utils.js         # DOM manipulation utilities
    └── event-bus.js         # Event communication system
```

## Component Lifecycle

Each component follows a consistent lifecycle:

1. **Constructor**: Initialize properties
2. **init()**: Setup elements and event listeners
3. **destroy()**: Cleanup resources and event listeners

## Event System

The global event bus enables component communication:

```javascript
// Emit events
globalEventBus.emit('itemSelected', { src: 'image.jpg', caption: 'Description' });

// Listen for events
globalEventBus.on('drawerOpened', () => {
  // Handle drawer opening
});
```

## Configuration

All animation parameters are centralized in `animation-config.js`:

```javascript
export const ANIMATION_CONFIG = {
  circularScroll: {
    rotationSpeed: 0.02,
    wheelSensitivity: 0.04,
    // ... more settings
  }
};
```

## Benefits of New Architecture

### 1. Maintainability
- Clear separation of concerns
- Easy to locate and fix issues
- Consistent code patterns

### 2. Testability
- Each component can be tested independently
- Mock dependencies easily
- Clear interfaces

### 3. Extensibility
- Add new features without modifying existing code
- Replace components without affecting others
- Plugin-like architecture

### 4. Performance
- Lazy initialization of components
- Proper cleanup of resources
- Optimized event handling

### 5. Debugging
- Clear component boundaries
- Centralized logging
- Easy to trace event flow

## Usage

The application automatically initializes when the DOM is ready. All components are managed by the main `App` class:

```javascript
// Access components if needed
const cursorManager = window.app.getComponent('cursor');
const drawerManager = window.app.getComponent('drawer');
```

## Migration Notes

- **No visual changes**: User experience remains identical
- **No breaking changes**: All functionality preserved
- **Better performance**: Optimized event handling and cleanup
- **Easier maintenance**: Clear component structure

## Future Enhancements

With this architecture, you can easily:

1. Add new interactive components
2. Implement component lazy loading
3. Add analytics and tracking
4. Create component-specific configurations
5. Implement A/B testing for different interactions
6. Add accessibility improvements
7. Create component-specific themes

## Browser Support

- Modern browsers with ES6 module support
- Fallback for older browsers can be added with bundlers
- Progressive enhancement approach maintained
