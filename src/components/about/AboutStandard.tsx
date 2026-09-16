import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { 
  DentalMirrorIcon, 
  SmileCurveIcon, 
  DentalScanIcon 
} from '../common/DentalIcons';

export const AboutStandard = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="standard" ref={sectionRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-10 sm:pt-14 lg:pt-16 pb-6 sm:pb-10 scroll-mt-24 sm:scroll-mt-28">
      <div className="text-center mb-12 sm:mb-14 reveal-up">

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-900">The Kush Standard</h2>
        <div className="w-12 h-0.5 bg-[#DCA51B] mx-auto mt-4 rounded-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Card 1 */}
        <div className="luxury-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between group cursor-default reveal-up">
          <div>
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center mb-6 text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 transition-all duration-300">
              <DentalMirrorIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-zinc-900 mb-2 group-hover:text-[#DCA51B] transition-colors">
              Expert Dentists
            </h3>
            <p className="font-sans text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
              Specialized doctors delivering gentle, reliable care for your whole family.
            </p>
          </div>
          <div className="w-8 h-0.5 bg-[#E8E2D5] group-hover:bg-[#DCA51B] group-hover:w-full transition-all duration-500 mt-6" />
        </div>
        
        {/* Card 2 */}
        <div className="luxury-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between group cursor-default reveal-up">
          <div>
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center mb-6 text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 transition-all duration-300">
              <SmileCurveIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-zinc-900 mb-2 group-hover:text-[#DCA51B] transition-colors">
              Pain-Free Comfort
            </h3>
            <p className="font-sans text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
              Calm private suites and gentle local numbing for anxiety-free visits.
            </p>
          </div>
          <div className="w-8 h-0.5 bg-[#E8E2D5] group-hover:bg-[#DCA51B] group-hover:w-full transition-all duration-500 mt-6" />
        </div>
        
        {/* Card 3 */}
        <div className="luxury-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between group cursor-default reveal-up">
          <div>
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center mb-6 text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 transition-all duration-300">
              <DentalScanIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-zinc-900 mb-2 group-hover:text-[#DCA51B] transition-colors">
              3D Digital Precision
            </h3>
            <p className="font-sans text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
              Optical 3D scans and low-dose imaging without messy dental putty.
            </p>
          </div>
          <div className="w-8 h-0.5 bg-[#E8E2D5] group-hover:bg-[#DCA51B] group-hover:w-full transition-all duration-500 mt-6" />
        </div>
      </div>
    </section>
  );
};
