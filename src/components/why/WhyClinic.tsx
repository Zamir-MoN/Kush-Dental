import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';

const features = [
  {
    num: "01",
    title: "Master Specialists",
    desc: "Internationally trained experts dedicated to aesthetic perfection and clinical longevity."
  },
  {
    num: "02",
    title: "Bespoke Hospitality",
    desc: "A concierge-level experience tailored to your ultimate comfort and peace of mind."
  },
  {
    num: "03",
    title: "Advanced Technology",
    desc: "State-of-the-art diagnostics and 3D planning for unparalleled precision."
  },
  {
    num: "04",
    title: "Lasting Results",
    desc: "Meticulous protocols ensuring enduring beauty and optimal oral health."
  }
];

export const WhyClinic = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="py-section-mobile md:py-section-desktop px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-light-gray border-y border-border/30">
      <div className="max-w-container mx-auto">
        <h2 className="font-display text-4xl lg:text-5xl mb-16 text-center reveal-up">
          Why Kush Dental Clinic
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              className="reveal-up bg-primary p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-t-2 border-transparent transition-colors cursor-hover shadow-sm flex flex-col"
              style={{ transitionDelay: `${i * 0.1}s` }}
              whileHover={{ 
                y: -4, 
                borderTopColor: '#DCA51B',
                transition: { duration: 0.3, ease: 'easeOut' }
              }}
            >
              <motion.span 
                className="font-display text-4xl sm:text-5xl text-secondary mb-4 sm:mb-6 block"
                whileHover={{ x: 4 }}
              >
                {feature.num}
              </motion.span>
              <h3 className="font-display text-xl sm:text-2xl mb-3 sm:mb-4 text-tertiary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-neutral text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
