import { useRef, useState } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { ArrowLeftRight, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const suiteImages = [
  {
    title: "Reception & Welcome Lounge",
    image: "/images/gallery/suite-1.jpg"
  },
  {
    title: "3D Digital Treatment Suite",
    image: "/images/gallery/suite-2.jpg"
  },
  {
    title: "Patient Lounge & Consultation",
    image: "/images/gallery/suite-3.jpg"
  },
  {
    title: "Precision Diagnostic Instruments",
    image: "/images/gallery/suite-4.jpg"
  },
  {
    title: "Private Operatory Suites Corridor",
    image: "/images/gallery/suite-5.jpg"
  }
];

const carouselSuites = [...suiteImages, ...suiteImages];

const transformations = [
  {
    title: "Porcelain Veneer Smile Makeover",
    subtitle: "Discoloration & alignment corrected",
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
    subtitle: "Worn edge & enamel repair",
    before: "/images/transformations/case3-before.jpg",
    after: "/images/transformations/case3-after.jpg"
  }
];

const Slider = ({ before, after, title, subtitle }: { before: string, after: string, title: string, subtitle: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Fallback
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className="reveal-up luxury-card rounded-3xl p-3.5 sm:p-4 flex flex-col justify-between group cursor-default">
      <div 
        ref={containerRef}
        role="slider"
        aria-label={`${title} comparison slider`}
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
        className="relative aspect-[16/10.5] w-full rounded-2xl overflow-hidden select-none bg-[#FAF7F2] mb-3 sm:mb-4 shadow-inner border border-[#E8E2D5] cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-[#DCA51B]"
      >
        {/* Before Image (Base Layer - Left side visible) */}
        <img 
          src={before} 
          alt="Before Treatment" 
          draggable={false}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        />
        
        {/* After Image (Clipped Overlay - Right side visible) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          <img 
            src={after} 
            alt="After Treatment" 
            draggable={false}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          />
        </div>

        {/* Divider Handle Line */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white/95 shadow-[0_0_8px_rgba(0,0,0,0.5)] pointer-events-none z-10 transition-colors duration-150"
          style={{ left: `${sliderPosition}%` }}
        >
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#141518] border-2 border-[#DCA51B] text-[#DCA51B] flex items-center justify-center shadow-xl transition-transform duration-150 ${
              isDragging ? 'scale-125 ring-4 ring-[#DCA51B]/40' : 'group-hover:scale-105'
            }`}
          >
            <ArrowLeftRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
        </div>

        {/* Before / After Badges */}
        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-sans font-bold text-white uppercase tracking-wider pointer-events-none shadow-sm">
          Before
        </span>
        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-[#DCA51B] text-[9px] font-sans font-bold text-[#141518] uppercase tracking-wider pointer-events-none shadow-sm">
          After
        </span>
      </div>

      <div className="px-1 pb-0.5">
        <h3 className="font-serif font-bold text-base sm:text-lg text-zinc-900 mb-0.5 group-hover:text-[#DCA51B] transition-colors leading-snug">
          {title}
        </h3>
        <p className="text-zinc-500 text-xs font-sans font-light leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export const BeforeAfterSlider = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const suitesScrollRef = useRef<HTMLDivElement>(null);

  const scrollSuites = (direction: 'left' | 'right') => {
    const el = suitesScrollRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>('a');
    const step = firstCard ? firstCard.getBoundingClientRect().width + 16 : 340;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (direction === 'right') {
      if (el.scrollLeft >= maxScroll - 20) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    } else {
      if (el.scrollLeft <= 20) {
        el.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: -step, behavior: 'smooth' });
      }
    }
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-18 xl:py-20 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-t border-[#E8E2D5] overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 reveal-up">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-zinc-900 leading-tight mb-2 tracking-tight">
            Smile Transformations
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm lg:text-base font-sans font-light leading-relaxed">
            Slide to explore real patient before &amp; after results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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

        {/* Modern Suites Gallery Carousel */}
        <div className="relative mt-12 sm:mt-16 reveal-up">
          {/* Left Navigation Arrow */}
          <button
            type="button"
            onClick={() => scrollSuites('left')}
            className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-zinc-800 hover:text-[#DCA51B] shadow-xl hover:shadow-2xl border border-[#E8E2D5] hover:border-[#DCA51B] flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Previous suites"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Suites Track */}
          <div
            ref={suitesScrollRef}
            className="flex items-center gap-3.5 sm:gap-4 lg:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
          >
            {carouselSuites.map((suite, idx) => (
              <Link
                key={idx}
                to="/about#gallery"
                className="group relative shrink-0 w-[260px] sm:w-[300px] md:w-[330px] lg:w-[360px] aspect-[16/10.5] rounded-2xl overflow-hidden border border-[#E8E2D5] bg-[#FAF7F2] shadow-sm hover:shadow-xl transition-all duration-300 block"
              >
                <img
                  src={suite.image}
                  alt={suite.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Navigation Arrow */}
          <button
            type="button"
            onClick={() => scrollSuites('right')}
            className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-zinc-800 hover:text-[#DCA51B] shadow-xl hover:shadow-2xl border border-[#E8E2D5] hover:border-[#DCA51B] flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Next suites"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* View Full Gallery Link Button */}
        <div className="text-center mt-7 sm:mt-9 reveal-up">
          <Link
            to="/about#gallery"
            className="btn-outline-luxury px-8 py-3.5 text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 group transition-all shadow-xs hover:shadow-md"
          >
            <span>VIEW FULL GALLERY</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
