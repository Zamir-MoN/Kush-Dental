import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import StaggeredMenu from '../ui/StaggeredMenu';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'About Us', href: '#about' },
    { name: 'Blog', href: '#blog' },
    { name: 'Case Studies', href: '#case-studies' },
  ];

  const staggeredMenuItems = [
    { label: 'Services', ariaLabel: 'Go to services', link: '#services' },
    { label: 'About Us', ariaLabel: 'Learn about us', link: '#about' },
    { label: 'Blog', ariaLabel: 'Read our blog', link: '#blog' },
    { label: 'Case Studies', ariaLabel: 'View case studies', link: '#case-studies' },
    { label: 'Book Visit', ariaLabel: 'Book an appointment', link: '/book' }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out
          ${isScrolled 
            ? 'bg-primary/90 backdrop-blur-xl border-b border-secondary/20 py-4 shadow-sm' 
            : 'bg-gradient-to-b from-background/90 via-background/50 to-transparent py-4 md:py-6'
          }`}
      >
        <div className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop flex justify-between items-center">
          <a href="#" className="flex items-center gap-3 md:gap-4 hover:opacity-80 transition-opacity duration-300">
            <img src="/images/logo.png" alt="Kush Dental Logo" className="h-8 md:h-10 w-auto object-contain" />
            <span className="font-display font-bold text-xl md:text-2xl text-tertiary">Kush Dental Clinic</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <a 
                key={link.name}
                href={link.href} 
                className={`label-small transition-colors duration-300 ${
                  i === 0 
                    ? 'text-secondary border-b border-secondary pb-1' 
                    : 'text-neutral hover:text-secondary'
                }`}
              >
                {link.name}
              </a>
            ))}
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
