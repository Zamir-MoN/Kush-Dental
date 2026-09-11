import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollReveal = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      // 1. Reveal-up elements with smooth stagger & slide
      const revealElements = ref.current?.querySelectorAll('.reveal-up');
      if (revealElements && revealElements.length > 0) {
        gsap.fromTo(
          revealElements,
          { 
            opacity: 0, 
            y: 45,
            scale: 0.98
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // 2. Image reveal animation
      const images = ref.current?.querySelectorAll('.img-reveal-anim');
      if (images && images.length > 0) {
        gsap.fromTo(
          images,
          { scale: 1.15, opacity: 0.4 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // 3. Line drawing animation
      const lines = ref.current?.querySelectorAll('.line-draw');
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          { width: '0%' },
          {
            width: '100%',
            duration: 1,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
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
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter,
            start: 'top 90%',
            toggleActions: 'play none none none'
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
