import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { treatments } from '../../data';
import { ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TreatmentCollection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-t border-[#E8E2D5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20 reveal-up">
          <div className="inline-flex items-center gap-2 mb-3.5">
            <Sparkles className="w-4 h-4 text-[#DCA51B] icon-subtle-pulse" />
            <span className="text-[#DCA51B] font-bold text-xs tracking-[0.22em] uppercase font-sans">
              PORTFOLIO OF CARE
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-900 leading-tight mb-4 tracking-tight">
            Curated Treatment Collection
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base font-sans font-light leading-relaxed">
            Meticulously customized clinical protocols tailored to preserve biological enamel and optimize smile harmony.
          </p>
        </div>
        
        <div className="space-y-3 max-w-4xl mx-auto reveal-up">
          {treatments.map((treatment, i) => {
            const isExpanded = expandedIndex === i;
            
            return (
              <div 
                key={i} 
                className={`border rounded-2xl transition-all duration-300 ${
                  isExpanded 
                    ? 'bg-white shadow-md border-[#DCA51B]/50' 
                    : 'bg-white/60 hover:bg-white border-[#E8E2D5]'
                }`}
              >
                <div 
                  className="py-5 sm:py-6 px-5 sm:px-8 flex justify-between items-center cursor-pointer select-none"
                  onClick={() => toggleAccordion(i)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                    <span className="font-serif font-bold text-xl sm:text-2xl text-zinc-900">
                      0{i + 1}. {treatment.title}
                    </span>
                    <span className="text-[11px] sm:text-xs font-sans font-bold tracking-widest text-[#DCA51B] uppercase">
                      {treatment.subtitle}
                    </span>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isExpanded ? 'bg-[#DCA51B] text-[#141518]' : 'bg-[#FAF7F2] text-zinc-600'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-8 pb-7 pt-1 max-w-3xl">
                        <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-6 font-sans font-light">
                          {treatment.description}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                          {treatment.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-zinc-800 font-sans text-xs sm:text-sm">
                              <CheckCircle2 className="w-4 h-4 text-[#DCA51B] shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          {treatment.metadata.map((meta, idx) => (
                            <span key={idx} className="bg-[#FAF7F2] border border-[#E8E2D5] px-3 py-1 rounded-lg text-xs font-semibold text-zinc-600">
                              {meta}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12 reveal-up">
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-[#DCA51B] border-b border-zinc-400 hover:border-[#DCA51B] pb-1 transition-colors group"
          >
            <span>VIEW FULL CLINICAL DIRECTORY</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
