let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let firstMove = true;

const customCursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (firstMove) {
    firstMove = false;
    cursorX = mouseX;
    cursorY = mouseY;
  }
});

function animateCursor() {
  const speed = 0.05; 
  cursorX += (mouseX - cursorX) * speed;
  cursorY += (mouseY - cursorY) * speed;
  customCursor.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px)`;
  requestAnimationFrame(animateCursor);
}

animateCursor();
