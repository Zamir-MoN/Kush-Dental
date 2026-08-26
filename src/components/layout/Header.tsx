import { useState, useEffect } from 'react';

import { Link, useLocation } from 'react-router-dom';
import StaggeredMenu from '../ui/StaggeredMenu';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { label: 'Book Visit', ariaLabel: 'Book an appointment', link: '/book' }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out
          ${isScrolled 
            ? 'bg-primary/95 backdrop-blur-xl border-b border-secondary/20 py-4 shadow-sm' 
            : 'bg-primary py-4 md:py-6'
          }`}
      >
        <div className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 md:gap-4 hover:opacity-80 transition-opacity duration-300">
            <img src="/images/logo.png" alt="Kush Dental Logo" className="h-8 md:h-10 w-auto object-contain" />
            <span className="font-display font-bold text-xl md:text-2xl text-tertiary">Kush Dental Clinic</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              // Exact match for Home, prefix match for others, ignore hash links for highlighting
              const isActive = link.to === '/' 
                ? location.pathname === '/' 
                : (!link.to.includes('#') && location.pathname.startsWith(link.to));

              return (
                <Link 
                  key={link.name}
                  to={link.to} 
                  className={`label-small transition-colors duration-300 ${
                    isActive 
                      ? 'text-secondary border-b border-secondary pb-1' 
                      : 'text-neutral hover:text-secondary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <Link to="/book" className="hidden md:block bg-secondary text-primary label-small px-6 py-3 rounded hover:bg-[#c49216] transition-colors duration-300 cursor-hover">
            Book Appointment
          </Link>

        </div>
      </header>

      <div className="md:hidden z-[100] relative">
        <StaggeredMenu
          position="right"
          items={staggeredMenuItems}
          displaySocials={false}
          colors={['#DCA51B', '#EAE8E6']}
          menuButtonColor="#111111"
          openMenuButtonColor="#111111"
          accentColor="#DCA51B"
          isFixed={true}
        />
      </div>
    </>
  );
};
