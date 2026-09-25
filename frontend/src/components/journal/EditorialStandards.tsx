import { ShieldCheck, Microscope, HeartHandshake } from 'lucide-react';

export const EditorialStandards = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "100% Peer-Reviewed Evidence",
      description: "Every published protocol and clinical perspective is referenced with contemporary dental research and clinical literature."
    },
    {
      icon: Microscope,
      title: "Biomimetic & Conservative",
      description: "We advocate strictly for tooth-preserving minimally invasive dentistry that respects biology and natural enamel vitality."
    },
    {
      icon: HeartHandshake,
      title: "Specialist Authored & Verified",
      description: "Written exclusively by practicing lead surgeons and prosthodontists with documented case studies and real clinical results."
    }
  ];

  return (
    <div className="my-16 p-8 sm:p-10 rounded-3xl luxury-card shadow-sm">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[#DCA51B] font-bold text-xs uppercase tracking-[0.2em] block mb-2 font-sans">
          OUR EDITORIAL OBLIGATION
        </span>
        <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#141518]">
          Rigorous Clinical Standards
        </h3>
        <div className="w-12 h-0.5 bg-[#DCA51B] mx-auto mt-3 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center p-4 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] transition-all duration-300 mb-4 shadow-sm shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#141518] mb-2">
                {pillar.title}
              </h4>
              <p className="font-sans text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
