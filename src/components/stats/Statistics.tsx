import { useRef } from 'react';
import { useCounter, useScrollReveal } from '../../hooks/useGsap';

export const Statistics = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  useCounter(sectionRef);

  return (
    <section ref={sectionRef} className="py-24 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-background border-b border-border/30">
      <div className="max-w-container mx-auto text-center reveal-up">
        <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32">
          
          <div className="flex flex-col items-center">
            <div className="flex items-baseline mb-4">
              <span className="font-display text-6xl md:text-7xl lg:text-[100px] text-secondary counter-anim leading-none" data-target="15">0</span>
              <span className="font-display text-6xl md:text-7xl lg:text-[100px] text-secondary leading-none">+</span>
            </div>
            <div className="w-8 h-px bg-border mb-4" />
            <span className="label-small text-neutral text-xs">Years of Excellence</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-baseline mb-4">
              <span className="font-display text-6xl md:text-7xl lg:text-[100px] text-secondary counter-anim leading-none" data-target="10">0</span>
              <span className="font-display text-6xl md:text-7xl lg:text-[100px] text-secondary leading-none">k</span>
            </div>
            <div className="w-8 h-px bg-border mb-4" />
            <span className="label-small text-neutral text-xs">Smiles Transformed</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-baseline mb-4">
              <span className="font-display text-6xl md:text-7xl lg:text-[100px] text-secondary counter-anim leading-none" data-target="50">0</span>
              <span className="font-display text-6xl md:text-7xl lg:text-[100px] text-secondary leading-none">+</span>
            </div>
            <div className="w-8 h-px bg-border mb-4" />
            <span className="label-small text-neutral text-xs">Global Awards</span>
          </div>

        </div>
      </div>
    </section>
  );
};
