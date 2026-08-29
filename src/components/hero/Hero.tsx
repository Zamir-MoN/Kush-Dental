import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

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

      <div className="flex flex-col md:grid md:grid-cols-12 gap-6 lg:gap-8 w-full relative z-10 h-full mt-12 md:mt-0 min-h-[80vh] md:min-h-0 items-center md:items-end">
        
        {/* Right Content (Doctor) - Higher vertical position on mobile so face & chest are completely visible */}
        <div className="absolute inset-0 md:relative md:col-span-6 lg:col-span-7 xl:col-span-6 flex items-start sm:items-end justify-center md:justify-end h-full z-10 md:order-2 pointer-events-none pt-4 sm:pt-0">
          <div className="relative w-full h-full flex items-start sm:items-end justify-center md:justify-end max-w-[360px] sm:max-w-[440px] lg:max-w-[500px]">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjsF7fRecc_cpRYBxWO2uQqv6p5QiEK2qMKVen5ACqtO1EOb-RzirP3c2f40XbOSsurGlWYbyFcj1XzHMM1OOnIc6XHn2seIDn0Md_trhN2S-LX_IuS-1U1FlUX7Meoq7D_iUJM5j5HcPj0LC5aNeHyxqewceMim6JSE-TNleAq6DFd7uNO1cQpGhlTzDHwNpFqUpmhbimNJFjNbEhPBRYEiHEmbKx4ZlHBY0bqJ8_ZCmIWWS_uj0uc6JH06oCvYNAk24" 
              alt="Dr. Alexander Kush" 
              className="hero-doc w-[105%] sm:w-[120%] md:w-full h-[75%] sm:h-full md:h-[105%] lg:h-[110%] object-contain object-top sm:object-bottom origin-top sm:origin-bottom mt-2 sm:mt-0"
              style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
            />
          </div>
        </div>

        {/* Left Content */}
        <div className="md:col-span-6 lg:col-span-5 xl:col-span-6 flex flex-col justify-end md:justify-center flex-1 order-2 md:order-1 mt-auto md:mt-0 z-20 pb-4 md:pb-6 lg:pb-0">
          <div className="hero-card bg-white/75 md:bg-white/45 backdrop-blur-xl border border-white/60 p-5 sm:p-7 md:p-8 lg:p-12 rounded-[2rem] shadow-xl md:shadow-md w-full max-w-full md:max-w-[420px] lg:max-w-none">
            
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-3xl lg:text-[54px] xl:text-[64px] leading-[1.15] text-tertiary mb-4 sm:mb-5 lg:mb-8 tracking-tight">
              Exceptional Dental Care, Designed Around You.
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-6 mt-4 lg:mt-6">
              <Link 
                to="/book" 
                className="bg-secondary text-white font-bold text-xs sm:text-xs md:text-sm uppercase tracking-wider px-6 lg:px-8 py-3.5 sm:py-3.5 lg:py-4 rounded-xl hover:bg-[#c49216] transition-all duration-300 shadow-sm active:scale-[0.98] text-center inline-flex items-center justify-center"
              >
                Discover Our Clinic
              </Link>
              <a 
                href="#about" 
                className="text-xs sm:text-xs md:text-sm text-tertiary uppercase tracking-wider inline-flex items-center justify-center sm:justify-start gap-1.5 hover:text-secondary transition-colors font-bold py-1.5 sm:py-2"
              >
                Learn More <ArrowDown className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
