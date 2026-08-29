import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { ArrowLeftRight } from 'lucide-react';

const transformations = [
  {
    title: "Porcelain Veneer Smile Makeover",
    subtitle: "Severe discoloration & misalignment corrected",
    before: "/images/transformations/case1-before.jpg",
    after: "/images/transformations/case1-after.jpg"
  },
  {
    title: "Laser Whitening & Alignment",
    subtitle: "Deep stain removal & space closure",
    before: "/images/transformations/case2-before.jpg",
    after: "/images/transformations/case2-after.jpg"
  },
  {
    title: "Cosmetic Edge Bonding & Veneers",
    subtitle: "Worn incisal edges & enamel repair",
    before: "/images/transformations/case3-before.jpg",
    after: "/images/transformations/case3-after.jpg"
  }
];

const Slider = ({ before, after }: { before: string, after: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);
  
  // Use useMotionTemplate to correctly interpolate the MotionValue into a string
  const clipPath = useMotionTemplate`inset(0 0 0 ${x}px)`;

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
      className="relative aspect-square w-full rounded-3xl overflow-hidden select-none bg-soft-gray"
    >
      {/* Before Image (Base) */}
      <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div className="absolute top-4 left-4 bg-tertiary/70 backdrop-blur text-primary text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">
        Before
      </div>

      {/* After Image (Clipped) */}
      <motion.div 
        className="absolute inset-0 z-10"
        style={{ clipPath }}
      >
        <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute top-4 right-4 bg-secondary/90 backdrop-blur text-primary text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">
          After
        </div>
      </motion.div>

      {/* Drag Handle */}
      <motion.div 
        className="absolute top-0 bottom-0 z-20 w-12 -ml-6 flex justify-center cursor-ew-resize touch-none group"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: containerWidth }}
        dragElastic={0}
        dragMomentum={false}
      >
        <div className="w-1 h-full bg-primary group-hover:bg-secondary transition-colors relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center border border-border pointer-events-none group-hover:scale-110 transition-transform">
            <ArrowLeftRight className="w-4 h-4 text-secondary" />
          </div>
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
