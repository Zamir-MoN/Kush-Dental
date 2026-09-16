import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqs } from '../../data';
import { useScrollReveal } from '../../hooks/useGsap';
import { Plus } from 'lucide-react';

export const FAQ = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-18 xl:py-20 px-4 sm:px-6 lg:px-12 bg-white border-b border-[#E8E2D5] overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 reveal-up">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-zinc-900 leading-tight mb-2 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm lg:text-base font-sans font-light leading-relaxed">
            Simple answers to common questions about visits, treatments, and care.
          </p>
        </div>
        
        <div className="space-y-2.5 sm:space-y-3">
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
                  className="w-full py-4 px-4 sm:px-6 flex justify-between items-center text-left cursor-pointer"
                >
                  <h4 className={`font-serif font-bold text-sm sm:text-base transition-colors pr-4 ${
                    isOpen ? 'text-[#DCA51B]' : 'text-zinc-900'
                  }`}>
                    {faq.question}
                  </h4>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[#DCA51B] text-[#141518]' : 'bg-[#FAF7F2] text-zinc-600'
                    }`}
                  >
                    <Plus strokeWidth={2} className="w-3.5 h-3.5" />
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
                      <p className="text-zinc-600 text-xs sm:text-sm font-sans font-light leading-relaxed px-4 sm:px-6 pb-5 pt-0.5">
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
