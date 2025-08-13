import gsap from "gsap";

const container = document.querySelector(".reactions");
const buttons = container.querySelectorAll("button");

// helper for small randomness
const rand = gsap.utils.random;

function spawnBubble(btn, emoji) {
  const bubble = document.createElement("span");
  bubble.className = "bubble";
  bubble.textContent = emoji;

  // place bubble at the button's center (relative to container)
  const cRect = container.getBoundingClientRect();
  const bRect = btn.getBoundingClientRect();
  const startX = (bRect.left - cRect.left) + bRect.width / 2;
  const startY = (bRect.top - cRect.top) + bRect.height / 2;

  container.appendChild(bubble);

  // initial state (no layout thrash)
  gsap.set(bubble, {
    x: startX,
    y: startY,
    scale: 0.9,
    rotation: rand(-15, 15, 1),
    autoAlpha: 0,
    transformOrigin: "50% 50%"
  });

  // target positions (gentle drift + float up)
  const driftX = startX + rand(-30, 30, 1);
  const floatY = startY - (110 + rand(0, 60, 1));

  // timeline: fade in + rise/drift/grow/rotate + fade out, then remove
  const tl = gsap.timeline({
    onComplete: () => bubble.remove()
  });

  tl.to(bubble, {
    autoAlpha: 1,
    duration: 0.12,
    ease: "power1.out"
  })
    .to(bubble, {
      x: driftX,
      y: floatY,
      scale: 1.15,
      rotation: `+=${rand(30, 90, 1)}`, // light spin
      duration: 0.9,
      ease: "power2.out"
    }, 0)
    .to(bubble, {
      y: "-=40",
      scale: 1.0,
      autoAlpha: 0,
      duration: 0.6,
      ease: "power1.in"
    }, "-=0.2");
}

// click to make one bubble
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const emoji = btn.dataset.emoji || btn.textContent.trim();
    spawnBubble(btn, emoji);
  });
});
