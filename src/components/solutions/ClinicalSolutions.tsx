import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useScrollReveal } from '../../hooks/useGsap';
import { services } from '../../data';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ClinicalSolutions = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const [selectedService, setSelectedService] = useState<any>(null);

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
    <section ref={sectionRef} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 mb-3.5 reveal-up">
            <Sparkles className="w-4 h-4 text-[#DCA51B] icon-subtle-pulse" />
            <span className="text-[#DCA51B] font-bold text-xs tracking-[0.22em] uppercase font-sans">
              SPECIALIZED DISCIPLINES
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-900 leading-tight mb-4 tracking-tight reveal-up">
            Comprehensive Clinical Excellence
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base font-sans font-light leading-relaxed reveal-up">
            From subtle micro-aesthetic porcelain enhancements to complex multi-unit full mouth rehabilitations.
          </p>
        </div>

        <div className="flex flex-col gap-20 lg:gap-28">
          {services.map((service, i) => {
            const isEven = i % 2 !== 0;
            return (
              <div key={service.number} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center reveal-up">
                
                {/* Text Content */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:pl-10 order-2' : 'lg:pr-10 order-2 lg:order-1'}`}>
                  <span className="font-serif font-bold text-6xl sm:text-7xl lg:text-8xl text-[#E8E2D5] block leading-none select-none mb-3">
                    {service.number}
                  </span>
                  
                  <div className="relative z-10 -mt-6 lg:-mt-8">
                    <h3 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl mb-4 text-zinc-900 leading-tight">
                      {service.title}
                    </h3>
                    
                    <p className="text-zinc-600 text-base sm:text-lg leading-relaxed mb-6 font-sans font-light">
                      {service.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2.5 mb-8">
                      {service.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="font-sans font-semibold text-xs uppercase tracking-wider bg-[#FAF7F2] text-zinc-700 border border-[#E8E2D5] px-3.5 py-1.5 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-5">
                      <button 
                        onClick={() => setSelectedService(service)}
                        className="btn-outline-luxury group cursor-pointer text-xs"
                      >
                        <span>EXPLORE SERVICE</span>
                        <ArrowRight className="w-4 h-4 text-[#DCA51B] group-hover:text-[#141518] group-hover:translate-x-1.5 transition-all duration-300" />
                      </button>

                      <Link 
                        to="/book" 
                        className="text-zinc-800 hover:text-[#DCA51B] font-sans font-bold text-xs uppercase tracking-wider transition-colors py-2 border-b border-zinc-400 hover:border-[#DCA51B] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>BOOK VISIT</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className={`lg:col-span-6 ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                  <div className="aspect-[4/3] lg:aspect-[16/11] bg-[#FAF7F2] overflow-hidden rounded-3xl shadow-xl border border-[#E8E2D5] group">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover img-reveal-anim transition-transform duration-700 group-hover:scale-105"
                    />
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
                className="fixed w-[92%] max-w-2xl bg-white rounded-3xl z-[101] p-6 sm:p-10 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E2D5]"
              >
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#FAF7F2] text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <span className="text-[#DCA51B] tracking-[0.2em] text-xs uppercase font-bold block mb-2 font-sans">
                  SERVICE NO. {selectedService.number}
                </span>
                
                <h2 className="font-serif text-3xl sm:text-4xl mb-4 text-zinc-900">{selectedService.title}</h2>
                
                <div className="w-full aspect-[16/9] mb-6 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8E2D5] shadow-sm">
                  <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
                </div>
                
                <p className="text-zinc-600 text-base leading-relaxed mb-6 font-sans font-light">
                  {selectedService.description}
                </p>
                
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {selectedService.tags.map((tag: string, idx: number) => (
                    <span 
                      key={idx}
                      className="font-sans font-semibold text-xs bg-[#FAF7F2] text-zinc-700 border border-[#E8E2D5] px-3.5 py-1.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="w-full border-t border-[#E8E2D5] pt-6 mt-auto flex flex-col sm:flex-row justify-between items-center gap-4">
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
