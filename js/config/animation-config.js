// Animation Configuration
export const ANIMATION_CONFIG = {
  circularScroll: {
    rotationSpeed: 0.02,
    wheelSensitivity: 0.04,
    dragSensitivity: 0.4,
    touchSensitivity: 0.3,
    touchThreshold: 20,
    maxRotation: 360
  },
  cursor: {
    followSpeed: 0.256,
    largeCursorLag: 0.6,
    cursorOffset: 10,
    largeCursorOffset: 20
  },
  drawer: {
    animationDuration: 300,
    escapeKey: 'Escape'
  },
  horizontalGallery: {
    scrollSpeed: 0.5,
    gap: 20,
    pauseOnHover: true
  }
};

export const SELECTORS = {
  circularScroll: {
    container: '.circular-scroll-container',
    circle: '.circular-scroll-circle',
    pin: '.circular-scroll-pin',
    items: '.circular-scroll-item img'
  },
  cursor: {
    container: '.custom-cursor-container',
    cursor: '.custom-cursor',
    largeCursor: '.custom-cursor-large'
  },
  drawer: {
    root: '#drawer-root',
    overlay: '.drawer-overlay',
    panel: '.drawer-panel',
    closeBtn: '.drawer-close',
    image: '#drawer-image',
    caption: '#drawer-caption'
  }
};
