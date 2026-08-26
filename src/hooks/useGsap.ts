import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollReveal = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!ref.current) return;
    
    // Setup prefers-reduced-motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      gsap.set(ref.current, { opacity: 1, y: 0 });
      return;
    }

    const elements = ref.current.querySelectorAll('.reveal-up');
    
    const ctx = gsap.context(() => {
      // Smooth section-level appearance
      if (ref.current) {
        gsap.fromTo(ref.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      }

      elements.forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      });
      
      const images = ref.current?.querySelectorAll('.img-reveal-anim');
      images?.forEach((img) => {
        gsap.fromTo(img,
          { clipPath: 'inset(100% 0 0 0)', scale: 1.05 },
          {
            clipPath: 'inset(0 0 0 0)',
            scale: 1,
            duration: 1.4,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: img,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      });
      
      const lines = ref.current?.querySelectorAll('.line-draw');
      lines?.forEach((line) => {
        gsap.fromTo(line,
          { width: 0 },
          {
            width: '100%',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 85%',
            }
          }
        );
      });
      
    }, ref);

    return () => ctx.revert();
  }, [ref]);
};

export const useCounter = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!ref.current) return;
    
    const ctx = gsap.context(() => {
      const counters = ref.current?.querySelectorAll('.counter-anim');
      counters?.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target') || '0');
        
        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: "power2.out",
          scrollTrigger: {
            trigger: counter,
            start: "top 90%",
            toggleActions: "play none none none"
          },
        });
      });
    }, ref);
    
    return () => ctx.revert();
  }, [ref]);
};
