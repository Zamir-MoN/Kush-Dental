import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/30 pt-16 pb-8 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand & Text */}
          <div className="reveal-up">
            <a href="#" className="flex items-center gap-3 mb-6">
              <img src="/images/logo.png" alt="Kush Dental Logo" className="h-8 w-auto object-contain" />
              <span className="font-display font-bold text-xl text-tertiary">Kush Dental Clinic</span>
            </a>
            <p className="text-neutral text-sm max-w-xs leading-relaxed">
              Exceptional Dental Care, Designed Around You. Integrating art and science.
            </p>
          </div>

          {/* Contact & Location */}
          <div className="reveal-up" style={{ transitionDelay: '0.1s' }}>
            <h4 className="label-small text-tertiary mb-6">Contact & Location</h4>
            <div className="text-neutral text-sm space-y-2">
              <p>123 Luxury Lane, Suite 100, Beverly Hills, CA 90210</p>
              <p>+1 (310) 555-0199 | concierge@kushdental.com</p>
            </div>
          </div>

          {/* Links & Social */}
          <div className="flex flex-col sm:flex-row justify-between md:justify-end gap-12 reveal-up" style={{ transitionDelay: '0.2s' }}>
            <div>
              <h4 className="label-small text-tertiary mb-6">Quick Links</h4>
              <nav className="text-neutral text-sm flex flex-col space-y-3">
                <Link to="/" className="hover:text-secondary transition-colors w-max cursor-hover">Home</Link>
                <Link to="/services" className="hover:text-secondary transition-colors w-max cursor-hover">Services</Link>
                <Link to="/about" className="hover:text-secondary transition-colors w-max cursor-hover">About Us</Link>
                <Link to="/blog" className="hover:text-secondary transition-colors w-max cursor-hover">Blog</Link>
                <Link to="/book" className="hover:text-secondary transition-colors w-max cursor-hover">Contact</Link>
              </nav>
            </div>
            
            <div>
              <h4 className="label-small text-tertiary mb-6">Social</h4>
              <nav className="text-neutral text-sm flex flex-col space-y-3">
                <a href="#" className="hover:text-secondary transition-colors w-max cursor-hover">Instagram</a>
                <a href="#" className="hover:text-secondary transition-colors w-max cursor-hover">Facebook</a>
                <a href="#" className="hover:text-secondary transition-colors w-max cursor-hover">LinkedIn</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border/30 text-xs text-neutral">
          <p>© 2024 Kush Dental Clinic. All Rights Reserved.</p>
          <div className="flex gap-6 label-small">
            <a href="#" className="hover:text-secondary transition-colors cursor-hover">Privacy</a>
            <a href="#" className="hover:text-secondary transition-colors cursor-hover">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
