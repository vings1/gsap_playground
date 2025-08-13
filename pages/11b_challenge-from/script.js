import gsap from 'gsap';

const card = document.querySelector('#card');

// (A) Entrance animation: subtle pop-in
gsap.from(card, {
  y: 60,
  opacity: 0,
  scale: 0.95,
  duration: 0.6,
  ease: 'power4.out'
});

// (B) Ensure 3D context + starting state
gsap.set(card, {
  transformStyle: 'preserve-3d',
  rotateY: 0
});

// (C) Hover flip: to 180 on enter, back to 0 on leave
card.addEventListener('mouseenter', () => {
  gsap.to(card, {
    rotateY: 180,
    duration: 0.4,
    ease: 'power1.inOut'
  });
});

card.addEventListener('mouseleave', () => {
  gsap.to(card, {
    rotateY: 0,
    duration: 0.4,
    ease: 'power1.inOut'
  });
});
