import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useScrollReveal } from '../../hooks/useGsap';
import { useModalAccessibility } from '../../hooks/useModalAccessibility';
import { homeServices } from '../../data';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  ToothSparkleIcon, 
  SmileCurveIcon, 
  DentalImplantIcon, 
  DentalCrownIcon, 
  ToothIcon 
} from '../common/DentalIcons';

export const ClinicalSolutions = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const [selectedService, setSelectedService] = useState<any>(null);

  const { modalRef } = useModalAccessibility({
    isOpen: !!selectedService,
    onClose: () => setSelectedService(null),
  });

  const getServiceIcon = (index: number) => {
    switch(index) {
      case 0: return DentalImplantIcon; // 01 Dental Implants
      case 1: return SmileCurveIcon;    // 02 Smile Design
      case 2: return ToothSparkleIcon;  // 03 Clear Aligners
      case 3: return DentalCrownIcon;    // 04 Root Canal Treatment
      case 4: return DentalCrownIcon;    // 05 Crown and Bridge
      default: return ToothIcon;
    }
  };

  const getTagIcon = (index: number, isDark: boolean = false) => {
    const colorClass = isDark ? "text-[#DCA51B]" : "text-[#DCA51B]";
    switch (index % 3) {
      case 0: return <ToothIcon className={`w-3.5 h-3.5 ${colorClass}`} />;
      case 1: return <Heart className={`w-3.5 h-3.5 ${colorClass}`} />;
      case 2: return <Shield className={`w-3.5 h-3.5 ${colorClass}`} />;
      default: return <CheckCircle2 className={`w-3.5 h-3.5 ${colorClass}`} />;
    }
  };

  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedService]);

  return (
    <section id="services" ref={sectionRef} className="py-16 sm:py-24 lg:py-32 bg-[#FAF7F2] overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      {/* Header Section */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 flex flex-col items-center">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-[56px] text-[#111111] leading-tight mb-4 tracking-tight reveal-up">
            Our Dental Treatments
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base lg:text-lg font-sans font-light leading-relaxed reveal-up max-w-2xl">
            Gentle dental care tailored to your comfort and long-term oral health.
          </p>
        </div>

        {/* Enclosed Cards List (Top 5 Services on Home Page) */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 w-full">
          {homeServices.map((service, i) => {
            const isDark = i % 2 !== 0; // Card 02, 04 are dark
            const isTextLeft = i % 2 !== 0; // Even cards (0,2,4): Image Left, Text Right. Odd cards (1,3): Text Left, Image Right.
            
            const titleColor = isDark ? 'text-white' : 'text-[#111111]';
            const descColor = isDark ? 'text-zinc-400' : 'text-zinc-600';
            const numberColor = isDark ? 'text-[#E5C178]/65' : 'text-[#B88A44]';
            const tagClass = isDark 
              ? 'bg-white/5 border-white/10 text-zinc-300 hover:border-[#DCA51B]/50' 
              : 'bg-[#FAF8F5] border-[#E8E2D5] text-zinc-700 hover:border-[#DCA51B]/40';

            const ServiceIcon = getServiceIcon(i);

            return (
              <div 
                key={service.number} 
                className={`w-full rounded-3xl sm:rounded-[36px] p-6 sm:p-8 lg:p-12 relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl reveal-up ${
                  isDark 
                    ? 'bg-[#131417] text-white border border-zinc-800 hover:border-[#DCA51B]/60 shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:shadow-[#DCA51B]/15' 
                    : 'bg-white text-[#111111] border border-[#EAE3D6] hover:border-[#DCA51B]/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)]'
                }`}
              >
                {/* 3 Continuous Traveling Wave Lines for Dark Cards */}
                {isDark && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <style>{`
                      @keyframes flowWaveLeft {
                        0% { transform: translate3d(0, 0, 0); }
                        100% { transform: translate3d(-600px, 0, 0); }
                      }
                      @keyframes flowWaveRight {
                        0% { transform: translate3d(-600px, 0, 0); }
                        100% { transform: translate3d(0, 0, 0); }
                      }
                    `}</style>

                    {/* Line 1 - Top Silver Wave (traveling right-to-left) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full w-[2400px] pointer-events-none"
                        style={{
                          animation: 'flowWaveLeft 24s linear infinite',
                          willChange: 'transform'
                        }}
                      >
                        <svg className="w-full h-full" viewBox="0 0 2400 600" fill="none" preserveAspectRatio="none">
                          <path
                            d="M 0 160 C 120 110, 180 110, 300 160 C 420 210, 480 210, 600 160 C 720 110, 780 110, 900 160 C 1020 210, 1080 210, 1200 160 C 1320 110, 1380 110, 1500 160 C 1620 210, 1680 210, 1800 160 C 1920 110, 1980 110, 2100 160 C 2220 210, 2280 210, 2400 160"
                            stroke="rgba(255, 255, 255, 0.08)"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Line 2 - Middle Warm Gold Accent Wave (traveling left-to-right with subtle gold whisper) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full w-[2400px] pointer-events-none"
                        style={{
                          animation: 'flowWaveRight 18s linear infinite',
                          willChange: 'transform'
                        }}
                      >
                        <svg className="w-full h-full" viewBox="0 0 2400 600" fill="none" preserveAspectRatio="none">
                          <path
                            d="M 0 300 C 120 230, 180 230, 300 300 C 420 370, 480 370, 600 300 C 720 230, 780 230, 900 300 C 1020 370, 1080 370, 1200 300 C 1320 230, 1380 230, 1500 300 C 1620 370, 1680 370, 1800 300 C 1920 230, 1980 230, 2100 300 C 2220 370, 2280 370, 2400 300"
                            stroke="rgba(220, 165, 27, 0.22)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Line 3 - Bottom Silver Wave (traveling right-to-left) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full w-[2400px] pointer-events-none"
                        style={{
                          animation: 'flowWaveLeft 30s linear infinite',
                          willChange: 'transform'
                        }}
                      >
                        <svg className="w-full h-full" viewBox="0 0 2400 600" fill="none" preserveAspectRatio="none">
                          <path
                            d="M 0 440 C 120 390, 180 390, 300 440 C 420 490, 480 490, 600 440 C 720 390, 780 390, 900 440 C 1020 490, 1080 490, 1200 440 C 1320 390, 1380 390, 1500 440 C 1620 490, 1680 490, 1800 440 C 1920 390, 1980 390, 2100 440 C 2220 490, 2280 490, 2400 440"
                            stroke="rgba(255, 255, 255, 0.06)"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center group relative z-10">
                  
                  {/* Image Section */}
                  <div className={`w-full lg:col-span-7 relative ${isTextLeft ? 'order-1 lg:order-2' : 'order-1 lg:order-1'}`}>
                    <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-[#FAF7F2] overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm border border-black/5 relative z-10">
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className={`w-full lg:col-span-5 relative z-20 ${isTextLeft ? 'order-2 lg:order-1' : 'order-2 lg:order-2'}`}>
                    
                    {/* Header Row: Service Badge (Left) & Number (Right) */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-2.5 sm:gap-3 group/badge cursor-pointer">
                        <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ease-out group-hover/badge:scale-110 group-hover/badge:-rotate-6 group-hover/badge:shadow-lg ${
                          isDark
                            ? 'bg-white text-[#131417] border-white group-hover/badge:bg-[#DCA51B] group-hover/badge:text-[#131417] group-hover/badge:border-[#DCA51B] group-hover/badge:shadow-[#DCA51B]/35'
                            : 'bg-[#F4F0EA] text-[#DCA51B] border-[#E8E2D5] group-hover/badge:bg-[#DCA51B] group-hover/badge:text-[#131417] group-hover/badge:border-[#DCA51B] group-hover/badge:shadow-[#DCA51B]/25'
                        }`}>
                          <ServiceIcon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/badge:scale-110" />
                        </div>
                        <span className="text-[#DCA51B] tracking-[0.16em] text-[11px] sm:text-xs uppercase font-bold font-sans transition-colors duration-300 group-hover/badge:text-[#E8BD4D]">
                          SERVICE {service.number}
                        </span>
                      </div>

                      <span className={`font-serif text-5xl sm:text-6xl lg:text-7xl font-normal select-none leading-none tracking-tight ${numberColor}`}>
                        {service.number}
                      </span>
                    </div>
                    
                    <h3 className={`font-serif font-bold text-3xl sm:text-4xl lg:text-[42px] ${titleColor} leading-tight mb-3 sm:mb-4`}>
                      {service.title}
                    </h3>
                    
                    <p className={`${descColor} text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 font-sans font-light`}>
                      {service.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-8 sm:mb-10">
                      {service.tags.map((tag, idx) => (
                        <div 
                          key={idx}
                          className={`flex items-center gap-2 border px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-xs transition-all duration-300 hover:-translate-y-0.5 ${tagClass}`}
                        >
                          {getTagIcon(idx, isDark)}
                          <span className="font-sans font-medium text-[11px] sm:text-sm capitalize">
                            {tag}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-start">
                      <Link 
                        to={`/services#service-${service.number}`}
                        className="btn-gold-luxury w-full sm:w-auto justify-center group cursor-pointer text-xs sm:text-sm py-3 px-7 rounded-full flex items-center gap-2.5 font-sans font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-lg"
                      >
                        <span>Explore Service</span>
                        <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to View All 12 Services */}
        <div className="mt-12 sm:mt-16 text-center reveal-up">
          <Link
            to="/services"
            className="btn-gold-solid py-3.5 px-8 sm:px-10 rounded-full font-sans font-bold text-xs sm:text-sm tracking-wider uppercase group shadow-lg shadow-[#DCA51B]/20"
          >
            <span>VIEW ALL 12 TREATMENTS</span>
            <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* Modal - matches the light theme closely for consistency */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedService && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedService(null)}
                className="fixed inset-0 bg-[#111111]/60 z-[100] backdrop-blur-md"
              />
              <motion.div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                initial={{ top: '100%', left: '50%', x: '-50%', y: 0, opacity: 0 }}
                animate={{ top: '50%', left: '50%', x: '-50%', y: '-50%', opacity: 1 }}
                exit={{ top: '100%', left: '50%', x: '-50%', y: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className="fixed w-[92%] max-w-2xl bg-[#FCF9F7] rounded-[2rem] z-[101] max-h-[90vh] shadow-2xl border border-[#E8E2D5] flex flex-col overflow-hidden"
              >
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-zinc-600 hover:text-zinc-900 shadow-sm flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 overscroll-contain">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[#DCA51B] tracking-[0.15em] text-[10px] sm:text-xs uppercase font-bold font-sans">
                      SERVICE {selectedService.number}
                    </span>
                  </div>
                  
                  <h2 id="modal-title" className="font-serif text-3xl sm:text-4xl mb-6 text-[#111111] pr-10">{selectedService.title}</h2>
                  
                  <div className="w-full max-h-[200px] sm:max-h-[300px] aspect-[16/9] mb-6 rounded-2xl overflow-hidden bg-white border border-[#E8E2D5] shadow-sm">
                    <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-8 font-sans font-light">
                    {selectedService.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-2">
                    {selectedService.tags.map((tag: string, idx: number) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-2 bg-white text-zinc-700 border border-[#E8E2D5] px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-xl"
                      >
                        {getTagIcon(idx, false)}
                        <span className="font-sans font-medium text-xs sm:text-sm capitalize">
                          {tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-full border-t border-[#E8E2D5] bg-white px-6 sm:px-10 py-4 sm:py-5 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-xs sm:text-sm text-zinc-500 font-sans">Ready for your bespoke consultation?</span>
                  <Link 
                    to="/book" 
                    onClick={() => setSelectedService(null)}
                    className="bg-[#DCA51B] hover:bg-[#c99517] w-full sm:w-auto justify-center text-white group cursor-pointer text-sm font-medium px-8 py-3 rounded-full flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                  >
                    <span>Book Appointment</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

    </section>
  );
};

