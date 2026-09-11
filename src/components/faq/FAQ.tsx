import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqs } from '../../data';
import { useScrollReveal } from '../../hooks/useGsap';
import { Plus, Sparkles } from 'lucide-react';

export const FAQ = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 bg-white border-b border-[#E8E2D5] overflow-hidden">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20 reveal-up">
          <div className="inline-flex items-center gap-2 mb-3.5">
            <Sparkles className="w-4 h-4 text-[#DCA51B] icon-subtle-pulse" />
            <span className="text-[#DCA51B] font-bold text-xs tracking-[0.22em] uppercase font-sans">
              COMMON INQUIRIES
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-900 leading-tight mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base font-sans font-light leading-relaxed">
            Clear answers regarding our bespoke treatments, 3D diagnostic technology, and appointment protocol.
          </p>
        </div>
        
        <div className="space-y-3.5">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`reveal-up border rounded-2xl transition-all duration-300 ${
                  isOpen ? 'border-[#DCA51B] bg-[#FAF7F2] shadow-sm' : 'border-[#E8E2D5] hover:border-[#DCA51B]/50 bg-white'
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full py-5 px-5 sm:px-7 flex justify-between items-center text-left cursor-pointer"
                >
                  <h4 className={`font-serif font-bold text-base sm:text-lg transition-colors pr-6 ${
                    isOpen ? 'text-[#DCA51B]' : 'text-zinc-900'
                  }`}>
                    {faq.question}
                  </h4>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[#DCA51B] text-[#141518]' : 'bg-[#FAF7F2] text-zinc-600'
                    }`}
                  >
                    <Plus strokeWidth={2} className="w-4 h-4" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                      className="overflow-hidden"
                    >
                      <p className="text-zinc-600 text-sm sm:text-base font-sans font-light leading-relaxed px-5 sm:px-7 pb-6 pt-1">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
