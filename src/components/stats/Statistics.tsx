import { useRef } from 'react';
import { useCounter, useScrollReveal } from '../../hooks/useGsap';
import { ToothSparkleIcon, SmileCurveIcon, DentalShieldIcon } from '../common/DentalIcons';

export const Statistics = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  useCounter(sectionRef);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-b border-[#E8E2D5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto text-center reveal-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#E8E2D5]">
          
          <div className="flex flex-col items-center pt-8 md:pt-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D5] text-[#DCA51B] flex items-center justify-center mb-3 shadow-xs">
              <ToothSparkleIcon className="w-5 h-5" />
            </div>
            <div className="flex items-baseline mb-2">
              <span className="font-serif font-bold text-6xl sm:text-7xl lg:text-8xl text-[#DCA51B] counter-anim leading-none" data-target="15">0</span>
              <span className="font-serif font-bold text-6xl sm:text-7xl lg:text-8xl text-[#DCA51B] leading-none">+</span>
            </div>
            <div className="w-12 h-0.5 bg-[#DCA51B]/40 my-3" />
            <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-widest text-zinc-900">Years Clinical Mastery</span>
            <span className="text-zinc-500 text-xs sm:text-sm font-sans font-light mt-1">Digital dentistry &amp; 3D care</span>
          </div>

          <div className="flex flex-col items-center pt-8 md:pt-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D5] text-[#DCA51B] flex items-center justify-center mb-3 shadow-xs">
              <SmileCurveIcon className="w-5 h-5" />
            </div>
            <div className="flex items-baseline mb-2">
              <span className="font-serif font-bold text-6xl sm:text-7xl lg:text-8xl text-[#DCA51B] counter-anim leading-none" data-target="12">0</span>
              <span className="font-serif font-bold text-6xl sm:text-7xl lg:text-8xl text-[#DCA51B] leading-none">k+</span>
            </div>
            <div className="w-12 h-0.5 bg-[#DCA51B]/40 my-3" />
            <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-widest text-zinc-900">Smiles Restored</span>
            <span className="text-zinc-500 text-xs sm:text-sm font-sans font-light mt-1">Healthy, radiant smile transformations</span>
          </div>

          <div className="flex flex-col items-center pt-8 md:pt-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D5] text-[#DCA51B] flex items-center justify-center mb-3 shadow-xs">
              <DentalShieldIcon className="w-5 h-5" />
            </div>
            <div className="flex items-baseline mb-2">
              <span className="font-serif font-bold text-6xl sm:text-7xl lg:text-8xl text-[#DCA51B] counter-anim leading-none" data-target="99">0</span>
              <span className="font-serif font-bold text-6xl sm:text-7xl lg:text-8xl text-[#DCA51B] leading-none">%</span>
            </div>
            <div className="w-12 h-0.5 bg-[#DCA51B]/40 my-3" />
            <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-widest text-zinc-900">Patient Satisfaction</span>
            <span className="text-zinc-500 text-xs sm:text-sm font-sans font-light mt-1">Verified 5-star clinic reviews</span>
          </div>

        </div>
      </div>
    </section>
  );
};
