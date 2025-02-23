let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let firstMove = true;

const customCursor = document.querySelector('.custom-cursor');

// Listen for mousemove events
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // On the very first mouse move, initialize cursorX/Y
  if (firstMove) {
    firstMove = true;
    cursorX = mouseX;
    cursorY = mouseY;
  }
});

function animateCursor() {
  // Lerp / smoothing
  const speed = 0.1;
  cursorX += (mouseX - cursorX) * speed;
  cursorY += (mouseY - cursorY) * speed;

  // Position the cursor (center it by subtracting half of its size if desired)
  customCursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;

  requestAnimationFrame(animateCursor);
}

animateCursor();
