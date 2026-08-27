import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-react';

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Set all hero elements to their final visible state immediately, bypassing animations
    if (!heroRef.current) return;
    
    gsap.set('.hero-bg', { opacity: 1, scale: 1 });
    gsap.set('.hero-card', { opacity: 1, y: 0 });
    gsap.set('.hero-title-line', { y: '0%' });
    gsap.set('.hero-doc', { opacity: 1, y: 0 });
    
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
        <div className="lg:col-span-5 xl:col-span-6 flex flex-col justify-end lg:justify-center flex-1 order-2 lg:order-1 mt-auto lg:mt-0 z-20 pb-0 pt-[30vh] lg:pt-0">
          <div className="hero-card bg-primary/20 backdrop-blur-md border border-primary/40 p-4 md:p-12 rounded-2xl shadow-sm self-start lg:self-auto max-w-[90vw] md:max-w-none mb-4 md:mb-0">
            
            <h1 className="font-display font-bold text-xl md:text-5xl lg:text-[72px] leading-[1.1] text-tertiary mb-3 lg:mb-8">
              <span className="block overflow-hidden pb-1 lg:pb-2">
                <span className="block hero-title-line">Exceptional Dental</span>
              </span>
              <span className="block overflow-hidden pb-1 lg:pb-2">
                <span className="block hero-title-line">Care, Designed</span>
              </span>
              <span className="block overflow-hidden pb-1 lg:pb-2">
                <span className="block hero-title-line">Around You.</span>
              </span>
            </h1>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-8 mt-1 lg:mt-4">
              <button className="bg-secondary text-primary label-small text-xs md:text-sm px-4 lg:px-8 py-2.5 lg:py-4 rounded hover:bg-[#c49216] transition-colors duration-300 cursor-hover w-full sm:w-auto text-center font-bold">
                Discover Our Clinic
              </button>
              <a href="#about" className="label-small text-xs md:text-sm text-tertiary flex items-center justify-center gap-2 hover:text-secondary transition-colors cursor-hover w-full sm:w-auto font-bold">
                Learn More <ArrowDown className="w-3 h-3 md:w-4 md:h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
