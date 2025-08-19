// showcase-card.js 

const cards = document.querySelectorAll('.showcase-card');

cards.forEach((card) => {
  let dragStartX = 0;
  let dragX = 0;
  let velocity = 0;
  let isDragging = false;
  let rafId = null;

  const maxTilt = 12;
  const dragThreshold = 100;

  const updateTransform = () => {
    const rotate = Math.min(Math.abs(dragX) / 5, maxTilt) * Math.sign(dragX);
    card.style.transform = `rotateZ(${rotate}deg)`;
  };

  const reset = () => {
    card.style.transition = 'transform 0.4s ease';
    card.style.transform = 'rotateZ(0deg)';
  };

  const flyAway = (direction) => {
    card.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    card.style.transform = `translateX(${direction * 1000}px) rotateZ(${direction * 24}deg)`;
    card.style.opacity = '0';

    setTimeout(() => {
      card.style.transition = 'none';
      card.style.transform = 'translateX(0) rotateZ(0deg)';
      card.style.opacity = '0';
      requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.6s ease';
        card.style.opacity = '1';
      });
    }, 600);
  };

  const stopAnimation = () => cancelAnimationFrame(rafId);

  const animate = () => {
    updateTransform();
    rafId = requestAnimationFrame(animate);
  };

  card.addEventListener('mousedown', (e) => {
    dragStartX = e.clientX;
    dragX = 0;
    isDragging = true;
    velocity = 0;
    stopAnimation();
    card.style.transition = 'none';
    animate();
  });

  card.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    velocity = deltaX - dragX;
    dragX = deltaX;
  });

  const endDrag = () => {
    stopAnimation();
    card.style.transition = 'transform 0.3s ease';
    if (Math.abs(dragX) < dragThreshold) {
      reset();
    } else {
      flyAway(Math.sign(dragX));
    }
    isDragging = false;
  };

  card.addEventListener('mouseup', endDrag);
  card.addEventListener('mouseleave', () => isDragging && endDrag());
});
