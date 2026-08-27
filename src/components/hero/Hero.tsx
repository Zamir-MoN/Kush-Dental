import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-react';

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Setup prefers-reduced-motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      const els = heroRef.current?.querySelectorAll('.hero-anim, .hero-stagger');
      els?.forEach(el => gsap.set(el, { opacity: 1, y: 0, scale: 1 }));
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. background image slowly fades in & scale 1.05 -> 1
      tl.fromTo('.hero-bg', 
        { opacity: 0, scale: 1.05 }, 
        { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }
      )
      // 3. text fades upward
      .fromTo('.hero-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        "-=1.5"
      )
      // 4. heading words reveal individually (simulated with lines)
      .fromTo('.hero-title-line',
        { y: '100%' },
        { y: '0%', duration: 1, stagger: 0.2, ease: 'power4.out' },
        "-=1.0"
      )
      // 5. doctor portrait rises/fades
      .fromTo('.hero-doc',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        "-=0.8"
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[100vh] lg:min-h-[600px] flex items-center pt-24 pb-12 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container mx-auto overflow-hidden rounded-b-[3rem]">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 hero-bg">
          <img 
            src="https://apollointeriors.com/wp-content/uploads/2023/08/taupe-dental-chair-landscape-1536x1024-1.jpeg" 
            alt="Clinic Exterior" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-primary/30" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none hero-bg">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUqDV_o5Mgk5cIymlfC8vhqvA4dsbeJmrFy817pGmTz5vizSC3AJNzRbq6auUBJ4Kci4MXiKyQU5KLf9hEe5ceHSQUp7-8g-lOtS4jWh0qro_noDfYYsTtK3a4dRwjRVq4lIVllcNVDOqNmE9s1ESUHROgMXetwuCqwO7T2Ke8UEvAfCgpXdFZAk5gi4G-ClZQ7S4H0TSPis_mQpMNJCVR6ApK3uaX6gQQl3QjJRA7xNY0xQndwT8EoVNL-2VAKNrqN6k" 
            alt="Gold Tooth Outline" 
            className="w-1/2 md:w-1/3 h-auto object-contain"
          />
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 w-full relative z-10 h-full mt-12 lg:mt-0 min-h-[80vh] lg:min-h-0">
        
        {/* Right Content (Doctor) - Absolute on mobile, relative on desktop */}
        <div className="absolute inset-0 lg:relative lg:col-span-7 xl:col-span-6 flex items-end justify-center lg:justify-end h-full z-10 lg:order-2 pointer-events-none">
          <div className="relative w-full h-full flex items-end justify-center lg:max-w-[500px]">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjsF7fRecc_cpRYBxWO2uQqv6p5QiEK2qMKVen5ACqtO1EOb-RzirP3c2f40XbOSsurGlWYbyFcj1XzHMM1OOnIc6XHn2seIDn0Md_trhN2S-LX_IuS-1U1FlUX7Meoq7D_iUJM5j5HcPj0LC5aNeHyxqewceMim6JSE-TNleAq6DFd7uNO1cQpGhlTzDHwNpFqUpmhbimNJFjNbEhPBRYEiHEmbKx4ZlHBY0bqJ8_ZCmIWWS_uj0uc6JH06oCvYNAk24" 
              alt="Dr. Alexander Kush" 
              className="hero-doc w-[130%] max-w-none md:w-full h-full md:h-[110%] object-contain object-bottom scale-95 origin-bottom"
              style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
            />
          </div>
        </div>

        {/* Left Content */}
        <div className="lg:col-span-5 xl:col-span-6 flex flex-col justify-end lg:justify-center flex-1 order-2 lg:order-1 mt-auto lg:mt-0 z-20 pb-4 lg:pb-0 pt-[50vh] lg:pt-0">
          <div className="hero-card bg-primary/20 backdrop-blur-md border border-primary/40 p-6 md:p-12 rounded-2xl shadow-sm">
            <p className="label-small text-secondary mb-4 lg:mb-6 uppercase tracking-wider font-bold">Kush Dental Clinic</p>
            
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-[72px] leading-[1.1] text-tertiary mb-6 lg:mb-8">
              <span className="block overflow-hidden pb-2">
                <span className="block hero-title-line">Exceptional Dental</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="block hero-title-line">Care, Designed</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="block hero-title-line">Around You.</span>
              </span>
            </h1>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8 mt-2 lg:mt-4">
              <button className="bg-secondary text-primary label-small px-6 lg:px-8 py-3 lg:py-4 rounded hover:bg-[#c49216] transition-colors duration-300 cursor-hover w-full sm:w-auto text-center font-bold">
                Discover Our Clinic
              </button>
              <a href="#about" className="label-small text-tertiary flex items-center justify-center gap-2 hover:text-secondary transition-colors cursor-hover w-full sm:w-auto font-bold">
                Learn More <ArrowDown className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
