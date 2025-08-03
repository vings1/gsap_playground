// Create the pulsing glow animation
gsap.to('.card', {
    duration: 1.8,
    filter: "drop-shadow(0 0 40px rgba(255, 255, 255, 0.6))",
    repeat: -1,
    yoyo: true,
    ease: "power1.inout"
});