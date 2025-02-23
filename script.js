// Track the real mouse position
let mouseX = 0;
let mouseY = 0;

// Track the position of the custom cursor (which will lag behind)
let cursorX = 0;
let cursorY = 0;

const customCursor = document.querySelector('.custom-cursor');

// Listen for mousemove events to capture real mouse position
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Animation loop
function animateCursor() {
  // Lerp (Linear Interpolation) to make it smooth
  // Increase 0.1 for faster movement, decrease for slower trailing
  const speed = 0.1; 
  cursorX += (mouseX - cursorX) * speed;
  cursorY += (mouseY - cursorY) * speed;

  // Update the position of the cursor element
  // We center the circle by subtracting half of its width/height (10px)
  customCursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;

  // Schedule the next animation frame
  requestAnimationFrame(animateCursor);
}

// Start the animation loop
animateCursor();
