import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useScrollReveal } from '../../hooks/useGsap';
import { services } from '../../data';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
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

  const getServiceIcon = (index: number) => {
    switch(index) {
      case 0: return SmileCurveIcon;
      case 1: return DentalCrownIcon;
      case 2: return DentalImplantIcon;
      case 3: return ToothSparkleIcon;
      default: return ToothIcon;
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
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-18 xl:py-20 px-4 sm:px-6 lg:px-12 bg-white overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-zinc-900 leading-tight mb-2 tracking-tight reveal-up">
            Our Dental Treatments
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm lg:text-base font-sans font-light leading-relaxed reveal-up">
            Gentle dental care tailored to your comfort and long-term oral health.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:gap-10 lg:gap-16 w-full">
          {services.map((service, i) => {
            const isEven = i % 2 !== 0;
            const ServiceIcon = getServiceIcon(i);
            return (
              <div 
                key={service.number} 
                className="w-full bg-[#FCFBF8] lg:bg-transparent rounded-3xl p-5 sm:p-7 lg:p-0 border border-[#E8E2D5] lg:border-none shadow-xs lg:shadow-none grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center reveal-up"
              >
                
                {/* Image (Mobile First, Desktop Alternating) */}
                <div className={`w-full lg:col-span-6 ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                  <div className="w-full aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/11] max-h-[360px] bg-[#FAF7F2] overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm lg:shadow-lg border border-[#E8E2D5] group">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover img-reveal-anim transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className={`w-full lg:col-span-6 ${isEven ? 'lg:pl-8 order-2' : 'lg:pr-8 order-2 lg:order-1'}`}>
                  {/* Service Number Badge & Icon Header */}
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white lg:bg-[#FAF7F2] border border-[#E8E2D5] text-[#DCA51B] flex items-center justify-center shrink-0 shadow-2xs">
                        <ServiceIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[#DCA51B] tracking-[0.16em] text-xs uppercase font-bold font-sans">
                        SERVICE {service.number}
                      </span>
                    </div>
                    <span className="font-serif font-bold text-3xl sm:text-4xl lg:text-6xl text-[#E8E2D5] select-none leading-none">
                      {service.number}
                    </span>
                  </div>
                  
                  <h3 className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-zinc-900 leading-tight mb-2.5">
                    {service.title}
                  </h3>
                  
                  <p className="text-zinc-600 text-xs sm:text-sm lg:text-[15px] leading-relaxed mb-4 font-sans font-light">
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-5 lg:mb-6">
                    {service.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="font-sans font-semibold text-[11px] uppercase tracking-wider bg-white lg:bg-[#FAF7F2] text-zinc-700 border border-[#E8E2D5] px-3 py-1 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center">
                    <button 
                      onClick={() => setSelectedService(service)}
                      className="btn-outline-luxury w-full sm:w-auto justify-center group cursor-pointer text-xs py-3 sm:py-2.5 px-6 rounded-xl flex items-center gap-2 font-sans font-semibold"
                    >
                      <span>EXPLORE SERVICE</span>
                      <ArrowRight className="w-4 h-4 text-[#DCA51B] group-hover:text-[#141518] group-hover:translate-x-1.5 transition-all duration-300" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Service Detail Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedService && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedService(null)}
                className="fixed inset-0 bg-[#141518]/70 z-[100] backdrop-blur-md"
              />
              <motion.div
                initial={{ top: '100%', left: '50%', x: '-50%', y: 0, opacity: 0 }}
                animate={{ top: '50%', left: '50%', x: '-50%', y: '-50%', opacity: 1 }}
                exit={{ top: '100%', left: '50%', x: '-50%', y: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className="fixed w-[92%] max-w-2xl bg-white rounded-3xl z-[101] max-h-[90vh] shadow-2xl border border-[#E8E2D5] flex flex-col overflow-hidden"
              >
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-[#FAF7F2] text-zinc-600 hover:text-zinc-900 border border-[#E8E2D5] shadow-xs flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Scrollable Content Container */}
                <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-9 overscroll-contain">
                  <span className="text-[#DCA51B] tracking-[0.2em] text-xs uppercase font-bold block mb-2 font-sans">
                    SERVICE NO. {selectedService.number}
                  </span>
                  
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl mb-4 text-zinc-900 pr-10">{selectedService.title}</h2>
                  
                  <div className="w-full max-h-[260px] aspect-[16/9] mb-5 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8E2D5] shadow-sm">
                    <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-6 font-sans font-light">
                    {selectedService.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedService.tags.map((tag: string, idx: number) => (
                      <span 
                        key={idx}
                        className="font-sans font-semibold text-xs bg-[#FAF7F2] text-zinc-700 border border-[#E8E2D5] px-3.5 py-1.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Fixed Modal Action Footer */}
                <div className="w-full border-t border-[#E8E2D5] bg-white px-6 sm:px-9 py-4 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="text-xs sm:text-sm text-zinc-500 font-sans">Ready for your bespoke consultation?</span>
                  <Link 
                    to="/book" 
                    onClick={() => setSelectedService(null)}
                    className="btn-gold-luxury group cursor-pointer text-xs"
                  >
                    <span>BOOK APPOINTMENT</span>
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
