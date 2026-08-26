import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useScrollReveal } from '../../hooks/useGsap';
import { services } from '../../data';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
    <section ref={sectionRef} className="py-section-mobile md:py-section-desktop px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-off-white">
      <div className="max-w-container mx-auto">
        
        <div className="text-center mb-24 reveal-up">
          <h2 className="font-display text-4xl lg:text-5xl mb-6">Our Clinical Solutions</h2>
          <div className="w-12 h-px bg-secondary mx-auto line-draw" />
        </div>

        <div className="flex flex-col gap-24 lg:gap-32">
          {services.map((service, i) => {
            const isEven = i % 2 !== 0;
            return (
              <div key={service.number} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center reveal-up">
                
                {/* Text Content */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:pl-12 order-2' : 'lg:pr-12 order-2 lg:order-1'}`}>
                  <span className="font-display text-7xl lg:text-[120px] text-soft-gray -ml-2 lg:-ml-6 block leading-none select-none mb-2 lg:-mb-12 relative z-0">
                    {service.number}
                  </span>
                  
                  <div className="relative z-10">
                    <h3 className="font-display text-3xl lg:text-4xl mb-6 text-tertiary">
                      {service.title}
                    </h3>
                    
                    <p className="text-neutral text-lg leading-relaxed mb-8">
                      {service.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mb-10">
                      {service.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="label-small text-[10px] border border-border px-4 py-2 rounded transition-colors hover:bg-secondary hover:text-primary hover:border-secondary cursor-hover"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => setSelectedService(service)}
                      className="bg-transparent border border-secondary text-secondary label-small px-8 py-4 rounded hover:bg-secondary hover:text-primary transition-colors duration-300 cursor-hover"
                    >
                      Explore Service
                    </button>
                  </div>
                </div>

                {/* Image */}
                <div className={`lg:col-span-6 ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                  <div className="aspect-[4/3] lg:aspect-[16/10] bg-soft-gray overflow-hidden rounded-3xl">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover img-reveal-anim transition-transform duration-1000 hover:scale-105"
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedService && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ top: '100%', left: '50%', x: '-50%', y: 0, opacity: 0 }}
              animate={{ top: '50%', left: '50%', x: '-50%', y: '-50%', opacity: 1 }}
              exit={{ top: '100%', left: '50%', x: '-50%', y: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed w-[95%] max-w-2xl bg-background rounded-3xl z-[101] p-8 md:p-12 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors cursor-hover"
              >
                <X className="w-6 h-6 text-tertiary" />
              </button>
              
              <span className="text-secondary tracking-[0.2em] text-sm uppercase font-display block mb-4">
                Service No. {selectedService.number}
              </span>
              <h2 className="font-display text-4xl mb-6 text-tertiary">{selectedService.title}</h2>
              <div className="w-full aspect-[16/9] mb-8 rounded-2xl overflow-hidden bg-soft-gray">
                <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
              </div>
              <p className="text-neutral text-lg leading-relaxed mb-8">
                {selectedService.description}
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {selectedService.tags.map((tag: string, idx: number) => (
                  <span 
                    key={idx}
                    className="label-small text-[11px] bg-soft-gray text-tertiary px-4 py-2 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="w-full border-t border-border/50 pt-8 mt-auto flex justify-between items-center">
                <span className="text-sm text-neutral">Ready for a consultation?</span>
                <a href="/book" className="bg-tertiary text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-tertiary/90 transition-colors cursor-hover">
                  Book Now
                </a>
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
