import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollReveal = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!ref.current) return;
    
    // Set all elements to their final visible state immediately, bypassing animations
    const elements = ref.current.querySelectorAll('.reveal-up');
    const images = ref.current.querySelectorAll('.img-reveal-anim');
    const lines = ref.current.querySelectorAll('.line-draw');
    
    gsap.set(ref.current, { opacity: 1, y: 0 });
    elements.forEach(el => gsap.set(el, { opacity: 1, y: 0 }));
    images.forEach(img => gsap.set(img, { clipPath: 'inset(0 0 0 0)', scale: 1 }));
    lines.forEach(line => gsap.set(line, { width: '100%' }));
  }, [ref]);
};

export const useCounter = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!ref.current) return;
    
    const counters = ref.current.querySelectorAll('.counter-anim');
    counters.forEach(counter => {
      const target = counter.getAttribute('data-target') || '0';
      counter.innerHTML = target;
    });
  }, [ref]);
};
