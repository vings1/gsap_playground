import gsap from 'gsap';

const toasts = document.querySelectorAll('.toast');

const showToastLoop = (index=0) => {

    const toast = toasts[index];
    gsap.to(toast, {
        y: -120,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power4.out',
        onComplete: () => {
            gsap.to('.toast',{
                delay: 2,
                opacity: 0,
                y: 0,
                scale: 0.95,
                duration: 0.7,
                ease: 'power1.in',
                onComplete: () => {
                    const nextIndex = (index + 1) % toasts.length;
                    setTimeout(() => showToastLoop(nextIndex), 500); // repeat after .5sec
                }
            })
        }
    })
}

showToastLoop();