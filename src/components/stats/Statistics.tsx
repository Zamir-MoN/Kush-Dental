import { useRef } from 'react';
import { useCounter, useScrollReveal } from '../../hooks/useGsap';
import { ToothSparkleIcon, SmileCurveIcon, DentalShieldIcon } from '../common/DentalIcons';

export const Statistics = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  useCounter(sectionRef);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-18 px-4 sm:px-6 lg:px-12 bg-[#141518] text-white border-y border-white/10 overflow-hidden relative scroll-mt-24 sm:scroll-mt-28">
      {/* Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#DCA51B]/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto text-center relative z-10 reveal-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
          
          <div className="flex flex-col items-center pt-6 md:pt-0">
            <div className="w-10 h-10 rounded-xl bg-[#1B1C20] border border-white/15 text-[#DCA51B] flex items-center justify-center mb-3 shadow-inner">
              <ToothSparkleIcon className="w-4 h-4" />
            </div>
            <div className="flex items-baseline justify-center gap-0.5 mb-1.5">
              <span className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none counter-anim" data-target="15">0</span>
              <span className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#DCA51B] leading-none">+</span>
            </div>
            <div className="w-8 h-[2px] bg-[#DCA51B] my-2.5 rounded-full" />
            <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.14em] text-white">Years Clinical Mastery</span>
            <span className="text-zinc-400 text-xs sm:text-[13px] font-sans font-normal mt-1 leading-relaxed">Digital dentistry &amp; 3D care</span>
          </div>

          <div className="flex flex-col items-center pt-6 md:pt-0">
            <div className="w-10 h-10 rounded-xl bg-[#1B1C20] border border-white/15 text-[#DCA51B] flex items-center justify-center mb-3 shadow-inner">
              <SmileCurveIcon className="w-4 h-4" />
            </div>
            <div className="flex items-baseline justify-center gap-0.5 mb-1.5">
              <span className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none counter-anim" data-target="12">0</span>
              <span className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#DCA51B] leading-none">k+</span>
            </div>
            <div className="w-8 h-[2px] bg-[#DCA51B] my-2.5 rounded-full" />
            <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.14em] text-white">Smiles Restored</span>
            <span className="text-zinc-400 text-xs sm:text-[13px] font-sans font-normal mt-1 leading-relaxed">Healthy, radiant smile transformations</span>
          </div>

          <div className="flex flex-col items-center pt-6 md:pt-0">
            <div className="w-10 h-10 rounded-xl bg-[#1B1C20] border border-white/15 text-[#DCA51B] flex items-center justify-center mb-3 shadow-inner">
              <DentalShieldIcon className="w-4 h-4" />
            </div>
            <div className="flex items-baseline justify-center gap-0.5 mb-1.5">
              <span className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none counter-anim" data-target="99">0</span>
              <span className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#DCA51B] leading-none">%</span>
            </div>
            <div className="w-8 h-[2px] bg-[#DCA51B] my-2.5 rounded-full" />
            <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.14em] text-white">Patient Satisfaction</span>
            <span className="text-zinc-400 text-xs sm:text-[13px] font-sans font-normal mt-1 leading-relaxed">Verified 5-star clinic reviews</span>
          </div>

        </div>
      </div>
    </section>
  );
};
