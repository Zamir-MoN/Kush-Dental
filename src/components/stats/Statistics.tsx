import { useRef } from 'react';
import { useCounter, useScrollReveal } from '../../hooks/useGsap';
import { ToothSparkleIcon, SmileCurveIcon, DentalShieldIcon } from '../common/DentalIcons';

export const Statistics = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  useCounter(sectionRef);

  return (
    <section ref={sectionRef} className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-b border-[#E8E2D5] overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-[1400px] mx-auto text-center reveal-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E8E2D5]">
          
          <div className="flex flex-col items-center pt-6 md:pt-0">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E8E2D5] text-[#DCA51B] flex items-center justify-center mb-3 shadow-xs">
              <ToothSparkleIcon className="w-4 h-4" />
            </div>
            <div className="flex items-baseline justify-center gap-0.5 mb-1.5">
              <span className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#141518] tracking-tight leading-none counter-anim" data-target="15">0</span>
              <span className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#DCA51B] leading-none">+</span>
            </div>
            <div className="w-8 h-[2px] bg-[#DCA51B]/40 my-2.5 rounded-full" />
            <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.14em] text-[#141518]">Years Clinical Mastery</span>
            <span className="text-stone-500 text-xs sm:text-[13px] font-sans font-normal mt-1 leading-relaxed">Digital dentistry &amp; 3D care</span>
          </div>

          <div className="flex flex-col items-center pt-6 md:pt-0">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E8E2D5] text-[#DCA51B] flex items-center justify-center mb-3 shadow-xs">
              <SmileCurveIcon className="w-4 h-4" />
            </div>
            <div className="flex items-baseline justify-center gap-0.5 mb-1.5">
              <span className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#141518] tracking-tight leading-none counter-anim" data-target="12">0</span>
              <span className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#DCA51B] leading-none">k+</span>
            </div>
            <div className="w-8 h-[2px] bg-[#DCA51B]/40 my-2.5 rounded-full" />
            <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.14em] text-[#141518]">Smiles Restored</span>
            <span className="text-stone-500 text-xs sm:text-[13px] font-sans font-normal mt-1 leading-relaxed">Healthy, radiant smile transformations</span>
          </div>

          <div className="flex flex-col items-center pt-6 md:pt-0">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E8E2D5] text-[#DCA51B] flex items-center justify-center mb-3 shadow-xs">
              <DentalShieldIcon className="w-4 h-4" />
            </div>
            <div className="flex items-baseline justify-center gap-0.5 mb-1.5">
              <span className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#141518] tracking-tight leading-none counter-anim" data-target="99">0</span>
              <span className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#DCA51B] leading-none">%</span>
            </div>
            <div className="w-8 h-[2px] bg-[#DCA51B]/40 my-2.5 rounded-full" />
            <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.14em] text-[#141518]">Patient Satisfaction</span>
            <span className="text-stone-500 text-xs sm:text-[13px] font-sans font-normal mt-1 leading-relaxed">Verified 5-star clinic reviews</span>
          </div>

        </div>
      </div>
    </section>
  );
};
