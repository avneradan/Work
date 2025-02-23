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
  const speed = 0.7; 
  cursorX += (mouseX - cursorX) * speed;
  cursorY += (mouseY - cursorY) * speed;
  customCursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
  requestAnimationFrame(animateCursor);
}

animateCursor();

<div class="star-wrapper">
  <object id="star-demo" type="image/svg+xml" data="/img/star.svg" alt="embedded svg"></object>

  <p style="padding: 0 5%">
    The <a href="https://github.com/taye/interact.js/blob/master/examples/star/star.svg?short_path=e1e0fe0">star.svg</a>
    file references interact.js as well as
    <a href="https://github.com/taye/interact.js/blob/master/examples/star/index.js"> another script</a>
    to enable and respond to drag events.
  </p>
</div>
