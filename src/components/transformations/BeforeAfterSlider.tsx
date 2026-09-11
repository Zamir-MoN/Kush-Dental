import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { ArrowLeftRight, Sparkles } from 'lucide-react';

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

const Slider = ({ before, after, title, subtitle }: { before: string, after: string, title: string, subtitle: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);
  
  const clipPath = useMotionTemplate`inset(0 0 0 ${x}px)`;

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      x.set(containerRef.current.offsetWidth / 2);
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        x.set(containerRef.current.offsetWidth / 2);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [x]);

  return (
    <div className="reveal-up luxury-card rounded-3xl p-4 sm:p-5 flex flex-col justify-between group cursor-default">
      <div 
        ref={containerRef} 
        className="relative aspect-square w-full rounded-2xl overflow-hidden select-none bg-[#FAF7F2] mb-5 shadow-inner border border-[#E8E2D5]"
      >
        {/* Before Image */}
        <img src={before} alt="Before Treatment" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute top-3.5 left-3.5 bg-[#141518]/85 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-md tracking-wider uppercase font-sans border border-white/10">
          Before
        </div>

        {/* After Image */}
        <motion.div 
          className="absolute inset-0 z-10"
          style={{ clipPath }}
        >
          <img src={after} alt="After Treatment" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
          <div className="absolute top-3.5 right-3.5 bg-[#DCA51B] text-[#141518] text-[10px] font-extrabold px-3 py-1 rounded-md tracking-wider uppercase font-sans shadow-md">
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
          <div className="w-1 h-full bg-[#DCA51B] relative shadow-md">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-[#DCA51B] pointer-events-none group-hover:scale-110 transition-transform">
              <ArrowLeftRight className="w-4 h-4 text-[#DCA51B]" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-2 pb-2">
        <h3 className="font-serif font-bold text-xl text-zinc-900 mb-1.5 group-hover:text-[#DCA51B] transition-colors leading-snug">
          {title}
        </h3>
        <p className="text-zinc-500 text-xs font-sans font-light">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export const BeforeAfterSlider = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-t border-[#E8E2D5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20 reveal-up">
          <div className="inline-flex items-center gap-2 mb-3.5">
            <Sparkles className="w-4 h-4 text-[#DCA51B] icon-subtle-pulse" />
            <span className="text-[#DCA51B] font-bold text-xs tracking-[0.22em] uppercase font-sans">
              REAL PATIENT OUTCOMES
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-900 leading-tight mb-4 tracking-tight">
            Smile Transformations
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base font-sans font-light leading-relaxed">
            Slide horizontally to reveal before and after results crafted with microscopic precision and biomimetic dental artistry.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {transformations.map((transform, i) => (
            <Slider 
              key={i} 
              before={transform.before} 
              after={transform.after} 
              title={transform.title}
              subtitle={transform.subtitle}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
