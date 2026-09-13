import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import StaggeredMenu, { type StaggeredMenuRef } from '../ui/StaggeredMenu';
import { useLoading } from '../../context/LoadingContext';

export const Header = () => {
  const { isLoaded } = useLoading();
  const staggeredMenuRef = useRef<StaggeredMenuRef>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Swiss Minimal Luxury Typography: Clean Title-case links
  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Services', to: '/services' },
    { name: 'About Us', to: '/about' },
    { name: 'Blog', to: '/blog' },
  ];

  const staggeredMenuItems = [
    { label: 'Home', ariaLabel: 'Go to home', link: '/' },
    { label: 'Services', ariaLabel: 'Go to services', link: '/services' },
    { label: 'About Us', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Blog', ariaLabel: 'Read our blog', link: '/blog' },
    { label: 'Book a Visit', ariaLabel: 'Book an appointment', link: '/book' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 pointer-events-none px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-3.5">
        <motion.div 
          initial={{ opacity: 0, y: -18 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
          transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[1380px] mx-auto w-full pointer-events-auto"
        >
          {/* Floating Luxury Island Container */}
          <div 
            className={`relative w-full rounded-2xl sm:rounded-3xl transition-all duration-300 flex items-center justify-between border ${
              isScrolled 
                ? 'bg-[#FAF7F2]/95 backdrop-blur-2xl border-[#E8E2D5] shadow-[0_12px_36px_rgba(20,21,24,0.1)] py-2 sm:py-2.5 px-3.5 sm:px-6' 
                : 'bg-[#FAF7F2]/90 backdrop-blur-xl border-[#E8E2D5]/80 shadow-[0_8px_30px_rgba(20,21,24,0.06)] py-2.5 sm:py-3 px-4 sm:px-6'
            }`}
          >
            {/* Subtle Luxury Top Gold Sheen */}
            <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-[#DCA51B]/40 to-transparent pointer-events-none rounded-full" />
            
            {/* 1. Brand Identity Crest */}
            <div className="flex items-center shrink-0">
              <BrandLogo size="md" />
            </div>

            {/* 2. Center Nav Items: Swiss Minimal Luxury (Refined Medium Sans, Title-case) */}
            <nav className="hidden lg:flex items-center bg-[#EFE9DF]/65 border border-[#E8E2D5]/80 rounded-full p-1 shadow-inner">
              {navLinks.map((link) => {
                const isActive = link.to === '/' 
                  ? location.pathname === '/' 
                  : (!link.to.includes('#') && location.pathname.startsWith(link.to));

                return (
                  <Link 
                    key={link.name}
                    to={link.to} 
                    className={`relative px-4 sm:px-5 py-1.5 rounded-full font-sans text-[13.5px] tracking-[0.01em] transition-colors duration-200 z-10 select-none ${
                      isActive 
                        ? 'text-[#141518] font-semibold' 
                        : 'text-zinc-600 hover:text-[#141518] font-medium'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeHeaderPill"
                        className="absolute inset-0 bg-white rounded-full shadow-xs border border-[#E8E2D5]/80 -z-10" 
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 3. Right Area: Golden CTA Button */}
            <div className="hidden lg:flex items-center shrink-0">
              <Link 
                to="/book" 
                className="btn-gold-luxury py-2 px-5 text-xs font-bold tracking-wider rounded-xl cursor-pointer inline-flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>BOOK A VISIT</span>
              </Link>
            </div>

            {/* Mobile/Tablet CTA Area & 3-Lines Menu Toggle (PROPERLY INSIDE PILL) */}
            <div className="lg:hidden flex items-center gap-2 sm:gap-2.5 shrink-0">
              <Link 
                to="/book" 
                className="btn-gold-luxury py-1.5 px-2.5 sm:px-4 text-[10.5px] sm:text-xs font-bold tracking-wider rounded-xl cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">BOOK A VISIT</span>
              </Link>

              {/* Perfectly centered 3-Lines Button inside the Header Pill */}
              <button
                type="button"
                onClick={() => {
                  staggeredMenuRef.current?.toggle();
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex flex-col items-center justify-center gap-[4.5px] p-1.5 hover:bg-[#EFE9DF] text-[#141518] transition-colors cursor-pointer select-none shrink-0"
                aria-label="Toggle navigation menu"
              >
                <span className="w-4 sm:w-4.5 h-[2px] bg-[#141518] rounded-full" />
                <span className="w-4 sm:w-4.5 h-[2px] bg-[#141518] rounded-full" />
                <span className="w-4 sm:w-4.5 h-[2px] bg-[#141518] rounded-full" />
              </button>
            </div>

          </div>
        </motion.div>
      </header>

      {/* Mobile Staggered Drawer */}
      <div className="lg:hidden z-[100] relative">
        <StaggeredMenu
          ref={staggeredMenuRef}
          hideToggle={true}
          position="right"
          items={staggeredMenuItems}
          displaySocials={false}
          colors={['#DCA51B', '#191A1E']}
          accentColor="#DCA51B"
          isFixed={true}
        />
      </div>
    </>
  );
};
