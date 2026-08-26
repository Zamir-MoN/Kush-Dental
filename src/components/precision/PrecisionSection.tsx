import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollReveal } from '../../hooks/useGsap';

export const PrecisionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);

  useEffect(() => {
    if (!bgRef.current || !sectionRef.current) return;
    
    // Parallax effect on the background image
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-section-mobile md:py-section-desktop relative overflow-hidden bg-tertiary text-primary min-h-[600px] flex items-center justify-center">
      
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0 h-[120%] -top-[10%]" ref={bgRef}>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiaJDhKRkpDTyKUUop2d4VQk0ia5e-bJq8s01fW-cdGnZomOV4Fh8vKoU-h0ci_YZwdpWBr1akZa95WL2lpMEq1jdZ9_pv7kHgKW6DGpuK5lXic8HY4cJ7ITG1aWEgUPWlo4-yOIpvNsS-2UifO1Zd1Aj6AG8o35g4tKSoAbBKd0qAUhkId8-Nmo_pZOYh6slooEbBXxcVO5pP7Y9C2e0Sj-eTN43qZYxOJ2TmrSyP1Jy_NCaVe4QMAA" 
          alt="Precision Technology" 
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tertiary/90 via-tertiary/60 to-tertiary/90" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-margin-mobile text-center reveal-up">
        <h2 className="font-display text-4xl lg:text-6xl mb-8">
          Precision Redefined
        </h2>
        <p className="text-primary/80 text-lg md:text-xl leading-relaxed mb-12 font-body font-light">
          Integrating the world's most advanced digital diagnostics and planning technologies for absolute accuracy and minimal invasiveness. Our CBCT and 3D imaging capabilities ensure predictable, superior outcomes.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {['CBCT Imaging', 'Intraoral Scanning', 'Digital Workflows'].map((label, i) => (
            <div 
              key={i} 
              className="bg-primary/10 backdrop-blur-md border border-primary/20 px-6 py-3 rounded-full label-small hover:border-secondary transition-colors cursor-hover"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
};
