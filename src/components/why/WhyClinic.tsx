import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { Sparkles, Award, HeartHandshake, Cpu, ShieldCheck } from 'lucide-react';

const features = [
  {
    num: "01",
    title: "Master Specialists",
    desc: "Internationally trained clinicians and prosthodontists dedicated to aesthetic perfection and clinical longevity.",
    icon: Award
  },
  {
    num: "02",
    title: "Bespoke Hospitality",
    desc: "A warm, concierge-level experience tailored to your ultimate comfort, relaxation, and peace of mind.",
    icon: HeartHandshake
  },
  {
    num: "03",
    title: "Advanced Technology",
    desc: "State-of-the-art 3D CBCT imaging, digital intraoral scanning, and precision computer-guided surgery.",
    icon: Cpu
  },
  {
    num: "04",
    title: "Enduring Results",
    desc: "Meticulous biomimetic protocols ensuring long-lasting dental strength and natural, radiant aesthetics.",
    icon: ShieldCheck
  }
];

export const WhyClinic = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-y border-[#E8E2D5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20">
          <div className="inline-flex items-center gap-2 mb-3.5 reveal-up">
            <Sparkles className="w-4 h-4 text-[#DCA51B] icon-subtle-pulse" />
            <span className="text-[#DCA51B] font-bold text-xs tracking-[0.22em] uppercase font-sans">
              THE KUSH DIFFERENCE
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-900 leading-tight mb-4 tracking-tight reveal-up">
            Why Discerning Patients Choose Us
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base font-sans font-light leading-relaxed reveal-up">
            We reject the rushed, sterile dental experience. Every touchpoint is curated for seamless comfort, clinical precision, and lasting peace of mind.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={i}
                className="reveal-up luxury-card p-7 sm:p-8 rounded-3xl flex flex-col justify-between group cursor-default"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif font-bold text-3xl sm:text-4xl text-[#DCA51B] block group-hover:scale-105 transition-transform duration-300">
                      {feature.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 transition-all duration-300">
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-xl sm:text-2xl mb-3 text-zinc-900 group-hover:text-[#DCA51B] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed font-sans font-light">
                    {feature.desc}
                  </p>
                </div>

                <div className="w-10 h-0.5 bg-[#E8E2D5] group-hover:bg-[#DCA51B] group-hover:w-full transition-all duration-500 mt-8" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
