import { useRef } from 'react';
import { useCounter, useScrollReveal } from '../../hooks/useGsap';

export const Statistics = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  useCounter(sectionRef);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-b border-[#E8E2D5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto text-center reveal-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#E8E2D5]">
          
          <div className="flex flex-col items-center pt-8 md:pt-0">
            <div className="flex items-baseline mb-3">
              <span className="font-serif font-bold text-6xl sm:text-7xl lg:text-8xl text-[#DCA51B] counter-anim leading-none" data-target="15">0</span>
              <span className="font-serif font-bold text-6xl sm:text-7xl lg:text-8xl text-[#DCA51B] leading-none">+</span>
            </div>
            <div className="w-12 h-0.5 bg-[#DCA51B]/40 my-3.5" />
            <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-widest text-zinc-900">Years of Clinical Mastery</span>
            <span className="text-zinc-500 text-xs sm:text-sm font-sans font-light mt-1">Pioneering digital dentistry & 3D workflows</span>
          </div>

          <div className="flex flex-col items-center pt-8 md:pt-0">
            <div className="flex items-baseline mb-3">
              <span className="font-serif font-bold text-6xl sm:text-7xl lg:text-8xl text-[#DCA51B] counter-anim leading-none" data-target="12">0</span>
              <span className="font-serif font-bold text-6xl sm:text-7xl lg:text-8xl text-[#DCA51B] leading-none">k+</span>
            </div>
            <div className="w-12 h-0.5 bg-[#DCA51B]/40 my-3.5" />
            <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-widest text-zinc-900">Smiles Transformed</span>
            <span className="text-zinc-500 text-xs sm:text-sm font-sans font-light mt-1">International patients across 40+ countries</span>
          </div>

          <div className="flex flex-col items-center pt-8 md:pt-0">
            <div className="flex items-baseline mb-3">
              <span className="font-serif font-bold text-6xl sm:text-7xl lg:text-8xl text-[#DCA51B] counter-anim leading-none" data-target="99">0</span>
              <span className="font-serif font-bold text-6xl sm:text-7xl lg:text-8xl text-[#DCA51B] leading-none">%</span>
            </div>
            <div className="w-12 h-0.5 bg-[#DCA51B]/40 my-3.5" />
            <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-widest text-zinc-900">Patient Satisfaction</span>
            <span className="text-zinc-500 text-xs sm:text-sm font-sans font-light mt-1">Verified 5-star Google & clinic ratings</span>
          </div>

        </div>
      </div>
    </section>
  );
};
