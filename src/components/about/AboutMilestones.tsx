import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Milestone {
  year: string;
  title: string;
  description: string;
}

const milestones: Milestone[] = [
  {
    year: '2008',
    title: 'Dental Surgery Distinction',
    description: 'Graduated with highest honors in Dental Surgery (BDS), receiving clinical recognition for academic and operative excellence.'
  },
  {
    year: '2010',
    title: 'Advanced Clinical Training',
    description: 'Completed specialized clinical fellowship in complex prosthodontics, aesthetic restorations, and comprehensive oral care.'
  },
  {
    year: '2012',
    title: 'Founded Kush Dental Clinic',
    description: 'Opened the doors to our flagship clinic, pioneering hospitality-centered dentistry in a calm, luxurious setting.'
  },
  {
    year: '2015',
    title: 'Aesthetic & 3D Guided Mastery',
    description: 'Integrated advanced CBCT 3D digital imaging, computer-guided implantology, and ultra-thin porcelain veneer artistry.'
  },
  {
    year: '2020',
    title: '10,000+ Smiles Restored',
    description: 'Celebrated the landmark milestone of transforming and rejuvenating over 10,000 confident patient smiles.'
  },
  {
    year: '2024',
    title: 'Digital Platform & AI Suite',
    description: 'Launched our state-of-the-art digital smile simulation suites and comprehensive virtual consultation platform.'
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
      className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-stack-lg md:py-28 overflow-hidden"
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
        <span className="inline-block px-4 py-1.5 bg-secondary/10 rounded-full font-body text-xs sm:text-sm font-semibold text-secondary mb-4 tracking-widest uppercase">
          Our Journey
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-tertiary tracking-tight">
          Experience & Milestones
        </h2>
        <div className="w-16 h-1 bg-secondary mx-auto mt-5 rounded-full" />
      </div>

      {/* Timeline Tree */}
      <div className="relative max-w-4xl mx-auto">
        {/* Background Track Line */}
        <div className="absolute top-0 bottom-0 left-[23px] md:left-1/2 -translate-x-1/2 w-[2px] bg-secondary/20 rounded-full" />

        {/* Animated Active Progress Line */}
        <div 
          ref={lineRef}
          className="absolute top-0 bottom-0 left-[23px] md:left-1/2 -translate-x-1/2 w-[2px] bg-secondary rounded-full shadow-[0_0_8px_rgba(220,165,27,0.5)] origin-top" 
        />

        <div className="flex flex-col gap-10 md:gap-16">
          {milestones.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.year}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                className={`relative flex items-center md:justify-between w-full ${
                  isEven ? 'md:flex-row-reverse' : 'md:flex-row'
                }`}
              >
                {/* Center / Left Node */}
                <div className="absolute left-[23px] md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                  <div className="milestone-node w-5 h-5 rounded-full bg-secondary border-[3px] border-background shadow-[0_0_12px_rgba(220,165,27,0.6)] transition-transform duration-300 hover:scale-125" />
                </div>

                {/* Empty Spacer on Opposite Side (Desktop) */}
                <div className="hidden md:block w-5/12" />

                {/* Content Block */}
                <div
                  className={`milestone-content pl-14 md:pl-0 w-full md:w-5/12 ${
                    isEven ? 'md:text-right' : 'md:text-left'
                  }`}
                >
                  <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-[20px] border border-border/40 hover:border-secondary/40 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <span className="inline-block font-display font-extrabold text-lg sm:text-xl text-secondary mb-1 tracking-tight">
                      {item.year}
                    </span>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-tertiary mb-2 group-hover:text-secondary transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm sm:text-base text-neutral leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
