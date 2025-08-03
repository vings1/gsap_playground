gsap.to('.card', {
    opacity: 1,
    scale: 1,
    duration: 5,
    onComplete: () => {
        gsap.to('.card', {
            y: -20,
            repeat: -1, //repear indefinatly
            yoyo: true, //come back and forth
            duration: 0.5,
        })
    }
});