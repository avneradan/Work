// Sophisticated 3D Carousel functionality
class Carousel3D {
  constructor() {
    this.carouselTrack = document.querySelector('.carousel-track');
    this.carouselItems = document.querySelectorAll('.carousel-item');
    this.totalItems = this.carouselItems.length;
    this.currentRotation = 0;
    this.targetRotation = 0;
    this.isAnimating = false;
    this.lastScrollY = 0;
    this.scrollDirection = 1;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.setupScrollListener();
    this.addPlaceholderContent();
    this.animate();
    this.updateActiveItem();
  }
  
  setupEventListeners() {
    // Add click events to carousel items
    this.carouselItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.rotateToItem(index);
      });
      
      // Add hover effects
      item.addEventListener('mouseenter', () => {
        this.onItemHover(index);
      });
      
      item.addEventListener('mouseleave', () => {
        this.onItemLeave(index);
      });
    });
  }
  
  setupScrollListener() {
    let ticking = false;
    
    const updateCarousel = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const carouselSection = document.querySelector('.carousel-section');
      const carouselRect = carouselSection.getBoundingClientRect();
      
      // Only animate when carousel is in view
      if (carouselRect.top < window.innerHeight && carouselRect.bottom > 0) {
        const viewportHeight = window.innerHeight;
        const carouselHeight = carouselRect.height;
        const carouselTop = carouselRect.top;
        
        // Calculate scroll progress through the carousel section
        const scrollProgress = Math.max(0, Math.min(1, 
          (viewportHeight - carouselTop) / (viewportHeight + carouselHeight)
        ));
        
        // Map scroll progress to rotation (0 to 360 degrees)
        this.targetRotation = scrollProgress * 360;
        
        // Smooth rotation with easing
        this.currentRotation += (this.targetRotation - this.currentRotation) * 0.08;
        
        this.updateCarouselRotation();
        this.updateActiveItem();
      }
      
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateCarousel);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Handle wheel events for smoother rotation
    carouselSection.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1 : -1;
      this.targetRotation += delta * 15;
      this.targetRotation = Math.max(0, Math.min(360, this.targetRotation));
    }, { passive: false });
  }
  
  updateCarouselRotation() {
    if (this.carouselTrack) {
      this.carouselTrack.style.transform = `translate(-50%, -50%) rotateY(${this.currentRotation}deg)`;
    }
  }
  
  updateActiveItem() {
    // Calculate which item should be active based on rotation
    const normalizedRotation = (this.currentRotation % 360 + 360) % 360;
    const itemAngle = 360 / this.totalItems;
    const activeIndex = Math.round(normalizedRotation / itemAngle) % this.totalItems;
    
    // Remove active class from all items
    this.carouselItems.forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to current item
    if (this.carouselItems[activeIndex]) {
      this.carouselItems[activeIndex].classList.add('active');
    }
  }
  
  rotateToItem(index) {
    const targetAngle = (index * 360 / this.totalItems);
    this.targetRotation = targetAngle;
    
    // Smooth animation to target item
    this.animateToTarget();
  }
  
  animateToTarget() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    const startRotation = this.currentRotation;
    const startTime = performance.now();
    const duration = 1000; // 1 second
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      this.currentRotation = startRotation + (this.targetRotation - startRotation) * easeOutCubic;
      this.updateCarouselRotation();
      this.updateActiveItem();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  onItemHover(index) {
    // Add subtle hover effect
    const item = this.carouselItems[index];
    if (item) {
      item.style.transform = item.style.transform.replace('scale(1)', 'scale(1.05)');
    }
  }
  
  onItemLeave(index) {
    // Remove hover effect
    const item = this.carouselItems[index];
    if (item) {
      item.style.transform = item.style.transform.replace('scale(1.05)', 'scale(1)');
    }
  }
  
  animate() {
    // Subtle continuous rotation for visual interest
    if (!this.isAnimating) {
      this.currentRotation += 0.02;
      this.updateCarouselRotation();
    }
    
    requestAnimationFrame(() => this.animate());
  }
  
  addPlaceholderContent() {
    // Add more sophisticated placeholder content
    const projectNames = [
      'Project Alpha',
      'Project Beta', 
      'Project Gamma',
      'Project Delta',
      'Project Epsilon',
      'Project Zeta',
      'Project Eta',
      'Project Theta',
      'Project Iota',
      'Project Kappa',
      'Project Lambda',
      'Project Mu'
    ];
    
    this.carouselItems.forEach((item, index) => {
      const placeholder = item.querySelector('.carousel-placeholder');
      if (placeholder) {
        placeholder.innerHTML = `
          <div style="text-align: center;">
            <div style="font-size: 18px; margin-bottom: 10px; opacity: 0.8;">${projectNames[index]}</div>
            <div style="font-size: 14px; opacity: 0.6;">Click to view</div>
          </div>
        `;
      }
    });
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Carousel3D();
});
