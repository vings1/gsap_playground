import gsap from "gsap";

// DOM
const dock = document.querySelector(".dock");
const icons = Array.from(document.querySelectorAll(".icon"));
const trigger = document.querySelector(".dock-trigger");

// State
let isDockVisible = false;
let isDockHovered = false;
let isTriggerHovered = false;
let isReadyForHover = false;
let isAnimating = false;

// mac-like tunables
const maxScale = 1.8;      // Peak size (macOS is ~1.75–1.8x)
const minScale = 1.0;      // Rest size
const liftPx = 10;         // Vertical lift at peak (subtle on macOS)
const influence = 65;      // Width of influence (~1.5 icons each side)
const microDur = 0.1;      // Smoothing for quick updates (fast but fluid)

// Fast setters (no layout thrash)
const scaleTo = icons.map(el =>
  gsap.quickTo(el, "scale", { duration: microDur, ease: "power2.out", overwrite: "auto" })
);
const yTo = icons.map(el =>
  gsap.quickTo(el, "y", { duration: microDur, ease: "power2.out", overwrite: "auto" })
);

// Ensure transform origins (important for magnification)
icons.forEach(el => el.style.transformOrigin = "50% 100%");

// Cache icon X centers (relative to dock)
let iconCenters = [];
function cacheIconCenters() {
  const dockRect = dock.getBoundingClientRect();
  iconCenters = icons.map(icon => {
    const r = icon.getBoundingClientRect();
    return (r.left + r.right) / 2 - dockRect.left;
  });
}
window.addEventListener("resize", cacheIconCenters);

// Bell-curve falloff
function magFactor(distance) {
  const sigma = influence;
  const fall = Math.exp(-(distance * distance) / (2 * sigma * sigma));
  return minScale + (maxScale - minScale) * Math.pow(fall, 1.2); // 1.2 sharpens the drop-off
}


// -------- Show / Hide --------
function showDock() {
  if (isAnimating || isDockVisible) return;
  isAnimating = true;

  // prevent trigger re-firing during show
  trigger.style.pointerEvents = "none";

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
      isDockVisible = true;
      isReadyForHover = true;
      cacheIconCenters(); // now that layout settled, cache centers
    }
  });

  tl.set(dock, { y: 0 }) // CSS has bottom:-150px, so start aligned (off-screen)
    .to(dock, { y: -150, duration: 0.5, ease: "back.out(1.4)" })
    .to(icons, {
      scale: 1, opacity: 1, duration: 0.28, stagger: 0.05, ease: "back.out(1.8)"
    }, "-=0.18");
}

function hideDock() {
  if (isAnimating || !isDockVisible) return;
  isAnimating = true;
  isReadyForHover = false;

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
      isDockVisible = false;
      trigger.style.pointerEvents = "auto";
      // reset for next time
      icons.forEach((_, i) => { scaleTo; yTo; });
    }
  });

  tl.to(icons, {
    scale: 0.9, opacity: 0, duration: 0.18, stagger: 0.03, ease: "power2.in"
  }).to(dock, {
    y: 0, duration: 0.35, ease: "power3.in"
  }, "-=0.06");
}

// -------- Events --------
trigger.addEventListener("mouseenter", () => {
  isTriggerHovered = true;
  if (!isDockVisible && !isAnimating) showDock();
});

trigger.addEventListener("mouseleave", () => {
  isTriggerHovered = false;
  // small delay to avoid flicker if cursor skims back into dock
  setTimeout(() => {
    if (!isDockHovered) hideDock();
  }, 90);
});

dock.addEventListener("mouseenter", () => {
  isDockHovered = true;
});

dock.addEventListener("mouseleave", () => {
  isDockHovered = false;
  // smooth return to base when leaving icons
  icons.forEach((_, i) => { scaleTo; yTo; });
  if (!isTriggerHovered) hideDock();
});

// Magnification on move
dock.addEventListener("mousemove", (e) => {
  if (!isDockVisible || !isDockHovered || !isReadyForHover) return;

  const dockRect = dock.getBoundingClientRect();
  const x = e.clientX - dockRect.left;

  for (let i = 0; i < icons.length; i++) {
    const d = Math.abs(x - iconCenters[i]);
    const s = magFactor(d);
    const lift = gsap.utils.mapRange(minScale, maxScale, 0, -liftPx, s);

    scaleTo[i](s);
    yTo[i](lift);
  }
});

// Optional click bounce
icons.forEach((icon) => {
  icon.addEventListener("click", () => {
    gsap.fromTo(icon, { y: "-=4" }, { y: "-=0", duration: 0.55, ease: "elastic.out(1, 0.5)" });
  });
});
