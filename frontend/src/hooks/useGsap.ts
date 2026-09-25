import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollReveal = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!ref.current) return;

    // On mobile devices, allow 100% native CSS rendering without running JS layout math
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Reveal-up elements: Crisp, batch-triggered without forced layout reflows
      const revealElements = ref.current?.querySelectorAll('.reveal-up');
      if (revealElements && revealElements.length > 0) {
        ScrollTrigger.batch(revealElements, {
          start: 'top 95%',
          once: true,
          interval: 0.02,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.36,
                stagger: 0.025,
                ease: 'power2.out',
                overwrite: 'auto',
                clearProps: 'transform,opacity'
              }
            );
          }
        });
      }

      // 2. Image reveal animation: Smooth and snappy
      const images = ref.current?.querySelectorAll('.img-reveal-anim');
      if (images && images.length > 0) {
        ScrollTrigger.batch(images, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { opacity: 0.85, scale: 1.02 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.45,
                ease: 'power2.out',
                overwrite: 'auto',
                clearProps: 'transform'
              }
            );
          }
        });
      }

      // 3. Line drawing animation
      const lines = ref.current?.querySelectorAll('.line-draw');
      if (lines && lines.length > 0) {
        ScrollTrigger.batch(lines, {
          start: 'top 95%',
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { width: '0%' },
              {
                width: '100%',
                duration: 0.4,
                ease: 'power2.out',
                overwrite: 'auto'
              }
            );
          }
        });
      }
    }, ref);

    return () => ctx.revert();
  }, [ref]);
};

export const useCounter = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const counters = ref.current?.querySelectorAll('.counter-anim');
      if (!counters || counters.length === 0) return;

      counters.forEach((counter) => {
        const targetValue = parseInt(counter.getAttribute('data-target') || '0', 10);
        const obj = { val: 0 };

        gsap.to(obj, {
          val: targetValue,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter,
            start: 'top 92%',
            once: true
          },
          onUpdate: () => {
            counter.innerHTML = Math.floor(obj.val).toString();
          }
        });
      });
    }, ref);

    return () => ctx.revert();
  }, [ref]);
};
