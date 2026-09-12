import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { treatments } from '../../data';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  ToothSparkleIcon, 
  SmileCurveIcon, 
  DentalImplantIcon, 
  DentalCrownIcon, 
  DentalShieldIcon 
} from '../common/DentalIcons';

export const TreatmentCollection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getTreatmentIcon = (index: number) => {
    switch(index) {
      case 0: return SmileCurveIcon;
      case 1: return ToothSparkleIcon;
      case 2: return DentalImplantIcon;
      case 3: return DentalShieldIcon;
      default: return DentalCrownIcon;
    }
  };

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-t border-[#E8E2D5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16 reveal-up">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-900 leading-tight mb-3 tracking-tight">
            Treatment Collection
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base font-sans font-light leading-relaxed">
            Personalized treatments for lasting oral health and natural smiles.
          </p>
        </div>
        
        <div className="space-y-3 max-w-4xl mx-auto reveal-up">
          {treatments.map((treatment, i) => {
            const isExpanded = expandedIndex === i;
            const TreatmentIcon = getTreatmentIcon(i);
            
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
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8E2D5] text-[#DCA51B] flex items-center justify-center shrink-0">
                      <TreatmentIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                      <span className="font-serif font-bold text-lg sm:text-xl text-zinc-900">
                        0{i + 1}. {treatment.title}
                      </span>
                      <span className="text-[10px] sm:text-xs font-sans font-bold tracking-widest text-[#DCA51B] uppercase">
                        {treatment.subtitle}
                      </span>
                    </div>
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
