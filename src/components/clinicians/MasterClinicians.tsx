import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clinicians } from '../../data';
import { useScrollReveal } from '../../hooks/useGsap';

export const MasterClinicians = () => {
  const [activeId, setActiveId] = useState(clinicians[0].id);
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const activeClinician = clinicians.find(c => c.id === activeId) || clinicians[0];

  return (
    <section ref={sectionRef} id="clinicians" className="py-section-mobile md:py-section-desktop px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-primary border-t border-border/30">
      <div className="max-w-container mx-auto">
        <h2 className="font-display text-4xl lg:text-5xl mb-16 text-center reveal-up">
          Master Clinicians
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 relative reveal-up" style={{ transitionDelay: '0.2s' }}>
          
          {/* Thumbnails (Left) */}
          <div className="flex md:flex-col gap-6 z-10 flex-wrap justify-center md:order-1 order-2">
            {clinicians.map((clinician) => {
              const isActive = clinician.id === activeId;
              return (
                <button
                  key={clinician.id}
                  onClick={() => setActiveId(clinician.id)}
                  className={`relative w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden transition-all duration-500 doc-thumb cursor-hover
                    ${isActive 
                      ? 'ring-2 ring-secondary ring-offset-4 ring-offset-primary opacity-100 scale-105' 
                      : 'opacity-60 grayscale filter blur-[1px] hover:opacity-80 hover:grayscale-0 hover:blur-none hover:scale-100'
                    }`}
                >
                  <img src={clinician.img} alt={clinician.name} className="w-full h-full object-cover object-top" />
                </button>
              );
            })}
          </div>

          {/* Active Profile Image (Center) */}
          <div className="relative w-64 h-64 lg:w-[400px] lg:h-[400px] rounded-full overflow-hidden border border-secondary shadow-sm z-20 md:order-2 order-1 bg-soft-gray">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeId}
                src={activeClinician.img} 
                alt={activeClinician.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full h-full object-cover object-top"
              />
            </AnimatePresence>
          </div>

          {/* Info (Right) */}
          <div className="flex flex-col z-10 w-full md:w-auto text-center md:text-left min-h-[200px] max-w-sm md:order-3 order-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <h3 className="font-display text-3xl mb-2 text-tertiary">{activeClinician.name}</h3>
                <p className="label-small text-secondary mb-4">{activeClinician.title}</p>
                <p className="text-neutral text-sm leading-relaxed mb-6">{activeClinician.desc}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {activeClinician.tags.map((tag, i) => (
                    <span key={i} className="bg-light-gray border border-border px-3 py-1 rounded text-xs text-neutral">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};
