import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { ArrowLeftRight } from 'lucide-react';

const transformations = [
  {
    before: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgzF_Mzh1YJ7M9CNmIbjIC8HNiIRpQy53-GxL_QfAdzaz5Hhsnmh6PCm9pY5eol4vctcJ9BaQteMGLgflKO1WKQeS9dxWvPqsfsBc7VnyN22fF99RYbVV-CLlZLUiP7oLKRXayP-vwy3iHwX4fgPnppB0NOaHyLQGW7-QPa2eonXDLEZTARfOOacspF0SIpH2PF4JDh2RLqkbWMRziVOJapijrHolvydARLisLnAoaNG8OKND6PvN6Rw",
    after: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBS5VUqYCscZO7nPeuMXtcwXxWIC_53-ogbhrJggHNy23HtkyCfoWVlXow0Lhmb4I1xkKfHtzwlbIyypLY6PczeQKo9l1rvg8NwroMVstNROGBSV8J_P74RbQlHDWcxj1C8jKWx60AlyeFu2UH03VxNpGSXDdAlbL4gfXnyRP6P8MXv1oyN3_FJJSQdTOvGH6iMBYUVkpadALdpPCs7VZj_K6EoA8Sn54iucPvDEKSARwts_4WeWQLxA"
  },
  {
    before: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmIGaTJcAUYC1BDPQdGyRYPyfkiPS_tsZezmvzXO_xILT6EDDRMgicvZ8cat2xzQkc3ZQP5iiATTYez6yRk49_ot0nfUpxBspy2D8XvGNKqA-8766V8xUrm0U3WvCWk0WmA6DTRv5bM-qTYgQ5s7CYEnXoSe8MsLUaNSGkbyzFN6QE-7BBjenWVXEJLSZ7NnYKn_s-mcFZK6sFREtclugWR2fCcNVjz6CK_MZcM86iQKXII5KpE1tXZg",
    after: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOeFi7tqH0NUouOk1N1931fNXTFgjd5F-U66uZ9Ihag8rc-rRMMpDnZcye6UyfRt-fX6bXpyq90yfuxO97wlkL8RE3Gu1eoNN1YXtQwZPrhTFWITEQoFBWynyOsY5bRE8jjxEgpRbHSKUG1LEFlQ2_jvF3ethikDpjuOAVVRh-EZKfI7e3ZWBd5I7Xd4dppNWA-2oZU590fhgTvAeOZnwca9E4cZ6EKuBEo9KyPT7j6zhfVB2PjuvBoQ"
  },
  {
    before: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhiFjxNPFTjvXrbd7dJjUQapcMCe01tOM1Jm1AAIl5guf9_YQI43Ikr8mKIU3SLNnY7o4ZxcA0TxLyBnpxiqE-7wJFJHPEbq19j5dYF8WZAx4dcyYAbIEJHKBcllg0DjnCCcaXkl3ddF_USWm5UyZf61uliNhQibcFtP0JRHC7EF6R2oufGHXxFuIYP6lhJpeEbyFKwTth1yVfEtg6caAiNdYCI6Lm7B1N6UGkxobGkF04uH2j-PcAnA",
    after: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUpnRi5sesTNL46CHrx6ohwm8eQGGcmtNi8jrKScQSBSuFi5fpufpiSR1mv128hqjbV7MX5LBchLeFrFQyMSD3K7vebqcEmebhe-4qQ9RdDpR0wgdnSupLkqWqnAPfn4y4vI-6rH6ixTSM8BQb2AcSS55MxKg3zQmoRBAFmj1Erv0cFONTsOeNDqLCNp6PPRUVA7eazKmLqM6AnC6EfnyclkynBgZK5InntizEhsLNnUkeEnUbM1rKDA"
  }
];

const Slider = ({ before, after }: { before: string, after: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);
  const clipWidth = useTransform(x, (val) => val);

  // Initialize bounds on mount and resize
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      x.set(containerRef.current.offsetWidth / 2);
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        // Reset to center on resize
        x.set(containerRef.current.offsetWidth / 2);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [x]);

  return (
    <div 
      ref={containerRef} 
      className="relative aspect-square w-full rounded-sm overflow-hidden select-none bg-soft-gray"
    >
      {/* Before Image (Base) */}
      <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div className="absolute top-4 right-4 bg-tertiary/70 backdrop-blur text-primary text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">
        Before
      </div>

      {/* After Image (Clipped) */}
      <motion.div 
        className="absolute inset-0 z-10"
        style={{ clipPath: `inset(0 calc(100% - ${clipWidth}px) 0 0)` }}
      >
        <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute top-4 left-4 bg-secondary/90 backdrop-blur text-primary text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">
          After
        </div>
      </motion.div>

      {/* Drag Handle */}
      <motion.div 
        className="absolute top-0 bottom-0 z-20 w-1 bg-primary cursor-ew-resize touch-none hover:bg-secondary transition-colors"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: containerWidth }}
        dragElastic={0}
        dragMomentum={false}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center border border-border pointer-events-none">
          <ArrowLeftRight className="w-4 h-4 text-secondary" />
        </div>
      </motion.div>
    </div>
  );
};

export const BeforeAfterSlider = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="py-section-mobile md:py-section-desktop px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-off-white">
      <div className="max-w-container mx-auto">
        <h2 className="font-display text-4xl lg:text-5xl mb-12 text-center reveal-up">
          Transformations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-up" style={{ transitionDelay: '0.2s' }}>
          {transformations.map((transform, i) => (
            <Slider key={i} before={transform.before} after={transform.after} />
          ))}
        </div>
      </div>
    </section>
  );
};
