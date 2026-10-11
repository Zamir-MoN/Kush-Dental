import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/staff')) {
    return null;
  }

  return (
    <footer className="bg-[#121316] text-white border-t border-white/10 pt-20 pb-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & Mission (Col 1-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <BrandLogo isDark={true} size="md" />
              </div>
              <p className="text-zinc-400 text-sm max-w-sm leading-relaxed font-sans mb-8">
                Gentle dental care, modern treatments, and healthy, confident smiles for the whole family.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a 
                href="https://www.instagram.com/kush_dentalclinic" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-[#141518] hover:bg-[#DCA51B] hover:border-[#DCA51B] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(220,165,27,0.35)] transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/919341131921" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-[#141518] hover:bg-[#DCA51B] hover:border-[#DCA51B] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(220,165,27,0.35)] transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 0C5.396 0 .012 5.385.012 12.02c0 2.122.553 4.195 1.603 6.01L0 24l6.115-1.604c1.764.954 3.756 1.458 5.916 1.458 6.635 0 12.02-5.385 12.02-12.02S18.666 0 12.031 0zm0 21.84c-1.785 0-3.535-.48-5.07-1.39l-.364-.216-3.77.99.99-3.676-.237-.378c-.997-1.59-1.524-3.427-1.524-5.312 0-5.518 4.492-10.01 10.01-10.01 5.517 0 10.009 4.492 10.009 10.01s-4.492 10.01-10.009 10.01zm5.495-7.514c-.301-.151-1.785-.882-2.062-.983-.277-.1-.478-.15-.679.151-.2.302-.779.983-.955 1.184-.176.202-.352.227-.653.076-1.566-.788-2.684-1.427-3.69-2.909-.258-.379.258-.352.846-1.53.076-.151.038-.277-.038-.428-.075-.15-.679-1.637-.93-2.241-.244-.59-.492-.51-.679-.52h-.578c-.201 0-.527.076-.804.378-.276.302-1.055 1.032-1.055 2.518 0 1.486 1.08 2.922 1.231 3.123.15.2 2.13 3.254 5.161 4.561 2.052.883 2.825.955 3.864.793 1.155-.181 2.228-.912 2.535-1.794.306-.882.306-1.637.214-1.794-.092-.151-.343-.227-.644-.378z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links (Col 6-7) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#DCA51B] mb-6 font-sans">
              QUICK LINKS
            </h4>
            <nav className="text-zinc-400 text-sm flex flex-col space-y-3.5 font-sans">
              <Link to="/" className="hover:text-[#DCA51B] hover:translate-x-1.5 transition-all duration-200 w-max inline-block">Home</Link>
              <Link to="/services" className="hover:text-[#DCA51B] hover:translate-x-1.5 transition-all duration-200 w-max inline-block">Services</Link>
              <Link to="/about" className="hover:text-[#DCA51B] hover:translate-x-1.5 transition-all duration-200 w-max inline-block">About Us</Link>
              <Link to="/blog" className="hover:text-[#DCA51B] hover:translate-x-1.5 transition-all duration-200 w-max inline-block">Journal & Blog</Link>
              <Link to="/book" className="hover:text-[#DCA51B] hover:translate-x-1.5 transition-all duration-200 w-max inline-block">Book Consultation</Link>
            </nav>
          </div>

          {/* Treatment Directory (Col 8-9) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#DCA51B] mb-6 font-sans">
              TREATMENTS
            </h4>
            <nav className="text-zinc-400 text-sm flex flex-col space-y-3.5 font-sans">
              <Link to="/services" className="hover:text-[#DCA51B] hover:translate-x-1.5 transition-all duration-200 w-max inline-block">Dental Implants</Link>
              <Link to="/services" className="hover:text-[#DCA51B] hover:translate-x-1.5 transition-all duration-200 w-max inline-block">Smile Design</Link>
              <Link to="/services" className="hover:text-[#DCA51B] hover:translate-x-1.5 transition-all duration-200 w-max inline-block">Clear Aligners</Link>
              <Link to="/services" className="hover:text-[#DCA51B] hover:translate-x-1.5 transition-all duration-200 w-max inline-block">Root Canal Care</Link>
              <Link to="/services" className="hover:text-[#DCA51B] hover:translate-x-1.5 transition-all duration-200 w-max inline-block">Crown & Bridge</Link>
            </nav>
          </div>

          {/* Contact & Hours (Col 10-12) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#DCA51B] mb-6 font-sans">
              CLINIC & HOURS
            </h4>
            <div className="text-zinc-400 text-sm space-y-4 font-sans">
              <div className="flex items-start gap-3 group">
                <MapPin className="w-4 h-4 text-[#DCA51B] shrink-0 mt-1 group-hover:scale-110 transition-transform duration-200" />
                <span className="group-hover:text-zinc-200 transition-colors">Kush Dental Clinic, Marathahalli, Bangalore</span>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 text-[#DCA51B] shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <a href="tel:9341131921" className="hover:text-[#DCA51B] transition-colors">9341131921</a>
              </div>
              <div className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 text-[#DCA51B] shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <a href="mailto:bhdental23@gmail.com" className="hover:text-[#DCA51B] transition-colors">bhdental23@gmail.com</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 text-xs text-zinc-500 font-sans">
          <p>© {new Date().getFullYear()} Kush Dental Clinic. All Rights Reserved.</p>
          
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
