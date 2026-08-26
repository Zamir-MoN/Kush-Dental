import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { services } from '../../data';

export const ClinicalSolutions = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

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
                    
                    <button className="bg-transparent border border-secondary text-secondary label-small px-8 py-4 rounded hover:bg-secondary hover:text-primary transition-colors duration-300 cursor-hover">
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
    </section>
  );
};
