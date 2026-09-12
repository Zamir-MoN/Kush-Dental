import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollReveal = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      // 1. Reveal-up elements: Crisp, immediate, batch-triggered per viewport entrance
      const revealElements = ref.current?.querySelectorAll('.reveal-up');
      if (revealElements && revealElements.length > 0) {
        // Pre-initialize elements that are strictly below viewport to prevent flashing
        revealElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.96) {
            gsap.set(el, { opacity: 1, y: 0 });
          } else {
            gsap.set(el, { opacity: 0, y: 14 });
          }
        });

        ScrollTrigger.batch(revealElements, {
          start: 'top 95%', // Triggers early as element enters viewport so there is zero perceived delay
          once: true, // Never re-hides; stays permanent and buttery smooth
          interval: 0.02,
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.36, // Snappy, effortless glide
              stagger: 0.025, // Micro-stagger (25ms) so groups feel coordinated without sluggish delay
              ease: 'power2.out',
              overwrite: 'auto',
              clearProps: 'transform,opacity' // Clean up inline styles so CSS hovers and layout work naturally
            });
          }
        });
      }

      // 2. Image reveal animation: Smooth and snappy
      const images = ref.current?.querySelectorAll('.img-reveal-anim');
      if (images && images.length > 0) {
        images.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top >= window.innerHeight * 0.95) {
            gsap.set(el, { opacity: 0.8, scale: 1.02 });
          }
        });

        ScrollTrigger.batch(images, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              scale: 1,
              duration: 0.45,
              ease: 'power2.out',
              overwrite: 'auto',
              clearProps: 'transform'
            });
          }
        });
      }

      // 3. Line drawing animation: Immediate and crisp
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
