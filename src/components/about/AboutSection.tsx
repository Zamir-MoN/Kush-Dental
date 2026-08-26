import { useRef } from 'react';
import { useScrollReveal, useCounter } from '../../hooks/useGsap';

export const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  useCounter(sectionRef);

  return (
    <section id="about" ref={sectionRef} className="section-padding section-container">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column (Doctor Card) */}
        <div className="lg:col-span-5 relative h-[450px] lg:h-[600px] mb-12 lg:mb-0 reveal-up">
          <img 
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop" 
            alt="Dr. Jenkins" 
            className="w-full h-full object-cover rounded-tr-[4rem] rounded-bl-[4rem] shadow-2xl border-4 border-primary"
          />
        </div>

        {/* Right Column (Text) */}
        <div className="lg:col-span-6 lg:col-start-7 reveal-up" style={{ transitionDelay: '0.2s' }}>

          
          <h2 className="font-display text-4xl lg:text-5xl mb-8 leading-[1.2]">
            Elevating dentistry to an art form.
          </h2>
          
          <p className="text-neutral text-lg leading-relaxed mb-10">
            We believe that a visit to the dentist should be a serene, restorative experience. By blending cutting-edge clinical precision with the attentive care of luxury hospitality, we have redefined the standard of dental excellence. Our digital workflows ensure predictable, minimally invasive treatments that honor your natural anatomy.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 border-y border-border/50 py-8">
            <div>
              <h4 className="font-display text-xl text-secondary mb-3">Holistic Assessment</h4>
              <p className="text-neutral text-sm leading-relaxed">
                Comprehensive diagnostic planning addressing both function and facial aesthetics.
              </p>
            </div>
            <div>
              <h4 className="font-display text-xl text-secondary mb-3">Biomimetic Care</h4>
              <p className="text-neutral text-sm leading-relaxed">
                Preserving maximum healthy tooth structure through advanced adhesive protocols.
              </p>
            </div>
          </div>
          
          <a href="#clinicians" className="label-small text-tertiary border-b border-tertiary pb-1 hover:text-secondary hover:border-secondary transition-colors cursor-hover">
            Meet Our Specialists
          </a>
        </div>

      </div>
    </section>
  );
};
