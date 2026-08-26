import { useRef } from 'react';
import { motion } from 'framer-motion';
import { testimonials } from '../../data';
import { useScrollReveal } from '../../hooks/useGsap';

export const PatientStories = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="py-section-mobile md:py-section-desktop bg-light-gray border-y border-border/30 overflow-hidden">
      <div className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop mb-12 text-center reveal-up">
        <h2 className="font-display text-4xl lg:text-5xl">Patient Stories</h2>
      </div>

      <div className="relative reveal-up" style={{ transitionDelay: '0.2s' }}>
        <motion.div 
          className="flex gap-6 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {/* Duplicate testimonials for infinite feel during dragging */}
          {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((testimonial, i) => (
            <motion.div 
              key={i}
              className="w-[320px] shrink-0 bg-primary p-8 rounded-3xl border border-border/50 border-t-4 border-t-secondary shadow-sm"
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <div className="flex gap-1 text-secondary mb-6">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-neutral italic text-sm leading-relaxed mb-6">
                "{testimonial.text}"
              </p>
              <p className="label-small text-tertiary">
                — {testimonial.author}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
