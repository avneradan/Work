let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let cursorLargeX = 0, cursorLargeY = 0;
let firstMove = true;

const customCursor = document.querySelector('.custom-cursor');
const customCursorLarge = document.querySelector('.custom-cursor-large');
const cursorContainer = document.querySelector('.custom-cursor-container');

// Make native cursor always invisible - apply immediately and comprehensively
function hideNativeCursor() {
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

// Hide cursor immediately when script loads
hideNativeCursor();

// Also hide cursor when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hideNativeCursor);
} else {
  hideNativeCursor();
}

// Hide cursor on window focus and visibility change to catch browser UI transitions
window.addEventListener('focus', hideNativeCursor);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    hideNativeCursor();
  }
});

// Hide cursor when pointer enters the window
window.addEventListener('pointerenter', hideNativeCursor);

// Skip on touch/coarse pointers (CSS also hides the custom cursor there)
if (matchMedia('(hover: hover) and (pointer: fine)').matches &&
    cursorContainer && customCursor && customCursorLarge) {

  function snapTo(x, y) {
    cursorX = x; cursorY = y;
    cursorLargeX = x; cursorLargeY = y;
    customCursor.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
    customCursorLarge.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
  }

  // Track pointer
  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (firstMove) { firstMove = false; snapTo(mouseX, mouseY); }
    cursorContainer.style.opacity = '1'; // keep visible inside the page
    // Ensure cursor stays hidden on every mouse move
    hideNativeCursor();
  }, { passive: true });

  // Smooth follow
  function animateCursor() {
    const speed = 0.256;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    customCursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;

    const lag = speed * 0.6;
    cursorLargeX += (mouseX - cursorLargeX) * lag;
    cursorLargeY += (mouseY - cursorLargeY) * lag;
    customCursorLarge.style.transform = `translate(${cursorLargeX - 20}px, ${cursorLargeY - 20}px)`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Fade out when leaving the window (don't toggle display)
  window.addEventListener('pointerleave', () => { cursorContainer.style.opacity = '0'; });

  // Re-enter: show & snap so there's no flash of native cursor
  function reenter() {
    cursorContainer.style.opacity = '1';
    if (firstMove) {
      const x = innerWidth / 2, y = innerHeight / 2;
      snapTo(x, y);
    }
  }
  window.addEventListener('focus', reenter);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') reenter();
  });
  window.addEventListener('pointerenter', (e) => {
    reenter();
    if (e.clientX || e.clientY) snapTo(e.clientX, e.clientY);
  });
}
