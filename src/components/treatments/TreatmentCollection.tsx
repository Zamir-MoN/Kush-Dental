import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { treatments } from '../../data';
import { ArrowRight } from 'lucide-react';

export const TreatmentCollection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-section-mobile md:py-section-desktop px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-background border-t border-border/30">
      <div className="max-w-container mx-auto">
        <h2 className="font-display text-4xl lg:text-5xl mb-16 text-center reveal-up">
          Treatment Collection
        </h2>
        
        <div className="border-t border-border/50 reveal-up">
          {treatments.map((treatment, i) => {
            const isExpanded = expandedIndex === i;
            
            return (
              <div 
                key={i} 
                className="border-b border-border/50 group cursor-hover transition-all"
                onClick={() => toggleAccordion(i)}
                onMouseEnter={() => {
                  if (window.innerWidth > 1024) setExpandedIndex(i);
                }}
                onMouseLeave={() => {
                  if (window.innerWidth > 1024) setExpandedIndex(null);
                }}
              >
                <div className="py-8 px-4 flex justify-between items-center bg-transparent transition-colors duration-300">
                  <div className="flex flex-col">
                    <span className="font-display text-2xl lg:text-3xl text-tertiary group-hover:text-secondary transition-colors duration-300">
                      {i + 1}. {treatment.title}
                    </span>
                    <span className="label-small text-neutral mt-2 transition-opacity duration-300 lg:group-hover:opacity-0">
                      {treatment.subtitle}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-neutral group-hover:text-secondary transition-colors"
                  >
                    <ArrowRight strokeWidth={1} className="w-8 h-8" />
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden bg-transparent"
                    >
                      <div className="px-4 pb-8 max-w-4xl">
                        <p className="text-neutral text-lg leading-relaxed mb-6">
                          {treatment.description}
                        </p>
                        
                        <ul className="list-none space-y-3 mb-8">
                          {treatment.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-tertiary">
                              <span className="text-secondary mt-1">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex flex-wrap gap-4">
                          {treatment.metadata.map((meta, idx) => (
                            <span key={idx} className="bg-primary border border-border px-4 py-2 rounded text-xs text-neutral">
                              {meta}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Desktop hover underline animation */}
                <div className="h-px bg-secondary w-0 group-hover:w-full transition-all duration-500 ease-out hidden lg:block" />
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-16 reveal-up">
          <button className="label-small text-tertiary border-b border-tertiary pb-1 hover:text-secondary hover:border-secondary transition-colors cursor-hover">
            View All Treatments
          </button>
        </div>
      </div>
    </section>
  );
};
