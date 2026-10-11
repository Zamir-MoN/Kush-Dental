import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ToothSparkleIcon, 
  DentalMirrorIcon, 
  SmileCurveIcon, 
  ToothIcon, 
  DentalImplantIcon, 
  DentalScanIcon 
} from '../common/DentalIcons';

gsap.registerPlugin(ScrollTrigger);

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const milestones: Milestone[] = [
  {
    year: '2002',
    title: 'Graduation (BDS)',
    description: 'Graduation BDS from KLE Dental College, Bengaluru.',
    icon: ToothIcon
  },
  {
    year: '2003',
    title: 'Clinical Practice',
    description: 'Commenced active clinical dental practice delivering comprehensive patient care.',
    icon: DentalMirrorIcon
  },
  {
    year: '2015',
    title: 'Post Graduate (MDS)',
    description: 'Post graduate from Vydehi Dental College, Bengaluru in MDS Oral and Maxillofacial Surgery.',
    icon: SmileCurveIcon
  },
  {
    year: '2015',
    title: 'Implantologist',
    description: 'Certified Implantologist practicing advanced surgical and guided implantology.',
    icon: DentalImplantIcon
  },
  {
    year: '2016',
    title: 'Laser Surgery',
    description: 'Integrated advanced minimally invasive dental laser surgery protocols.',
    icon: DentalScanIcon
  },
  {
    year: '2018',
    title: 'Hair Transplant',
    description: 'Advanced clinical training and surgical practice in hair transplantation.',
    icon: ToothSparkleIcon
  }
];

export const AboutMilestones = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate vertical spine progress line
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom 80%',
              scrub: 1
            }
          }
        );
      }

      // Animate each milestone item
      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        const isEven = index % 2 === 0;
        const node = item.querySelector('.milestone-node');
        const content = item.querySelector('.milestone-content');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });

        if (node) {
          tl.fromTo(
            node,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.8)' }
          );
        }

        if (content) {
          const isMobile = window.innerWidth < 768;
          const xOffset = isMobile ? 25 : isEven ? -40 : 40;

          tl.fromTo(
            content,
            { opacity: 0, x: xOffset, y: 15 },
            { opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.3'
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-[#121316] text-white border-y border-white/10 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden"
    >
      {/* Ambient Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[650px] bg-[#DCA51B]/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20 reveal-up">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-3">
            Experience &amp; <span className="italic font-normal text-[#DCA51B]">Milestones</span><span className="text-[#DCA51B]">.</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm lg:text-base font-sans font-light leading-relaxed">
            Over a decade of surgical distinctions, continuous clinical education, and pioneering digital care.
          </p>
          <div className="w-12 h-0.5 bg-[#DCA51B] mx-auto mt-4 rounded-full" />
        </div>

        {/* Timeline Tree */}
        <div className="relative max-w-4xl mx-auto">
          {/* Background Track Line */}
          <div className="absolute top-0 bottom-0 left-[23px] md:left-1/2 -translate-x-1/2 w-[2px] bg-white/15 rounded-full" />

          {/* Animated Active Progress Line */}
          <div 
            ref={lineRef}
            className="absolute top-0 bottom-0 left-[23px] md:left-1/2 -translate-x-1/2 w-[2px] bg-[#DCA51B] rounded-full shadow-[0_0_12px_rgba(220,165,27,0.7)] origin-top" 
          />

          <div className="flex flex-col gap-8 md:gap-14">
            {milestones.map((item, index) => {
              const isEven = index % 2 === 0;
              const Icon = item.icon;

              return (
                <div
                  key={`${item.year}-${index}`}
                  ref={(el) => {
                    itemsRef.current[index] = el;
                  }}
                  className={`relative flex items-center md:justify-between w-full ${
                    isEven ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                >
                  {/* Center / Left Node */}
                  <div className="absolute left-[23px] md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                    <div className="milestone-node w-5 h-5 rounded-full bg-[#DCA51B] border-[3px] border-[#121316] ring-2 ring-[#DCA51B]/50 shadow-[0_0_14px_rgba(220,165,27,0.7)] transition-transform duration-300 hover:scale-125" />
                  </div>

                  {/* Empty Spacer on Opposite Side (Desktop) */}
                  <div className="hidden md:block w-5/12" />

                  {/* Content Block */}
                  <div
                    className={`milestone-content pl-14 md:pl-0 w-full md:w-5/12 ${
                      isEven ? 'md:text-right' : 'md:text-left'
                    }`}
                  >
                    <div className="bg-[#1B1C20] border border-white/10 hover:border-[#DCA51B]/70 hover:-translate-y-1 p-6 sm:p-7 rounded-3xl group cursor-default shadow-xl hover:shadow-[0_16px_36px_rgba(220,165,27,0.18)] transition-all duration-400 ease-out">
                      <div className={`flex items-center gap-2.5 mb-2 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                        <div className="w-8 h-8 rounded-xl bg-[#121316] border border-white/15 flex items-center justify-center text-[#DCA51B] shrink-0 group-hover:scale-110 group-hover:bg-[#DCA51B] group-hover:text-[#121316] transition-all duration-300 shadow-inner">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-serif font-bold text-lg sm:text-xl text-[#DCA51B] tracking-tight">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-white mb-2 group-hover:text-[#DCA51B] transition-colors duration-200">
                        {item.title}
                      </h3>
                      <p className="font-sans text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
