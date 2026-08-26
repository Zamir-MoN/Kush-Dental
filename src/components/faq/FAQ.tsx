import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqs } from '../../data';
import { useScrollReveal } from '../../hooks/useGsap';
import { Plus } from 'lucide-react';

export const FAQ = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section ref={sectionRef} className="py-section-mobile md:py-section-desktop px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-primary border-b border-border/30">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-4xl lg:text-5xl mb-16 text-center reveal-up">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-2 reveal-up" style={{ transitionDelay: '0.2s' }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-border/50 pb-2">
                <button
                  onClick={() => toggle(i)}
                  className="w-full py-6 flex justify-between items-center group cursor-hover text-left"
                >
                  <h4 className="font-display text-xl lg:text-2xl text-tertiary group-hover:text-secondary transition-colors pr-8">
                    {faq.question}
                  </h4>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-neutral group-hover:text-secondary transition-colors shrink-0"
                  >
                    <Plus strokeWidth={1.5} className="w-6 h-6" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-neutral text-sm leading-relaxed pb-8 pr-12">
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
