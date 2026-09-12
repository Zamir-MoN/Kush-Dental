import { useEffect, useRef, createContext, useContext } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: any) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {}
});

export const useLenis = () => useContext(SmoothScrollContext);

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll Engine
    const lenis = new Lenis({
      duration: 0.8, // Crisp, responsive scroll duration (eliminates sluggish inertia delay)
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
      infinite: false
    });

    lenisRef.current = lenis;

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(500, 33);

    // 3. Smooth anchor link interceptor
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -80,
            duration: 1.4,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Initial ScrollTrigger refresh
    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // 4. Scroll to top on route change smoothly and refresh triggers
  useEffect(() => {
    const resetScroll = () => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const t1 = setTimeout(resetScroll, 50);
    const t2 = setTimeout(resetScroll, 150);
    const t3 = setTimeout(() => {
      resetScroll();
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [location.pathname]);

  const scrollTo = (target: string | number | HTMLElement, options?: any) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};
