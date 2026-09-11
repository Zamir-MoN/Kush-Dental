import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrandLogo } from './BrandLogo';
import StaggeredMenu from '../ui/StaggeredMenu';

export const Header = () => {
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

  const navLinks = [
    { name: 'HOME', to: '/' },
    { name: 'SERVICES', to: '/services' },
    { name: 'ABOUT US', to: '/about' },
    { name: 'BLOG', to: '/blog' },
  ];

  const staggeredMenuItems = [
    { label: 'HOME', ariaLabel: 'Go to home', link: '/' },
    { label: 'SERVICES', ariaLabel: 'Go to services', link: '/services' },
    { label: 'ABOUT US', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'BLOG', ariaLabel: 'Read our blog', link: '/blog' },
    { label: 'BOOK A VISIT', ariaLabel: 'Book an appointment', link: '/book' }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#E8E2D5]/80 py-3.5 sm:py-4' 
            : 'bg-[#FAF7F2] border-b border-[#E8E2D5]/40 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center w-full">
          
          {/* 1. Left Brand Logo */}
          <div className="flex items-center">
            <BrandLogo size="md" />
          </div>

          {/* 2. Center Nav Items */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = link.to === '/' 
                ? location.pathname === '/' 
                : (!link.to.includes('#') && location.pathname.startsWith(link.to));

              return (
                <Link 
                  key={link.name}
                  to={link.to} 
                  className={`text-xs font-extrabold tracking-[0.16em] uppercase transition-all duration-200 relative py-2 ${
                    isActive 
                      ? 'text-[#DCA51B]' 
                      : 'text-[#222222] hover:text-[#DCA51B]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span 
                      layoutId="activeHeaderUnderline"
                      className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#DCA51B] rounded-full shadow-sm" 
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Area: Direct Book a Visit Button */}
          <div className="hidden sm:flex items-center">
            <Link 
              to="/book" 
              className="bg-[#DCA51B] hover:bg-[#C49216] text-[#121316] font-extrabold text-xs uppercase tracking-wider px-6 sm:px-7 py-3 rounded-full shadow-md hover:shadow-lg hover:shadow-[#DCA51B]/25 transition-all duration-300 active:scale-95 cursor-pointer inline-flex items-center justify-center font-sans"
            >
              BOOK A VISIT
            </Link>
          </div>

          {/* Mobile CTA Area */}
          <div className="lg:hidden flex items-center gap-3">
            <Link 
              to="/book" 
              className="bg-[#DCA51B] text-[#121316] font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-full shadow-sm"
            >
              BOOK A VISIT
            </Link>
          </div>

        </div>
      </header>

      {/* Mobile Staggered Drawer */}
      <div className="lg:hidden z-[100] relative">
        <StaggeredMenu
          position="right"
          items={staggeredMenuItems}
          displaySocials={false}
          colors={['#DCA51B', '#191A1E']}
          menuButtonColor="#111111"
          openMenuButtonColor="#111111"
          accentColor="#DCA51B"
          isFixed={true}
        />
      </div>
    </>
  );
};
