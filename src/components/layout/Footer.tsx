import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer = () => {
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
                Exceptional dental care designed around you. We seamlessly integrate the art of facial aesthetics with advanced digital dental science.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-[#DCA51B] hover:border-[#DCA51B] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-[#DCA51B] hover:border-[#DCA51B] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-[#DCA51B] hover:border-[#DCA51B] transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
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
              <Link to="/" className="hover:text-white transition-colors w-max">Home</Link>
              <Link to="/services" className="hover:text-white transition-colors w-max">Services</Link>
              <Link to="/about" className="hover:text-white transition-colors w-max">About Us</Link>
              <Link to="/blog" className="hover:text-white transition-colors w-max">Journal & Blog</Link>
              <Link to="/book" className="hover:text-white transition-colors w-max">Book Consultation</Link>
            </nav>
          </div>

          {/* Treatment Directory (Col 8-9) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#DCA51B] mb-6 font-sans">
              TREATMENTS
            </h4>
            <nav className="text-zinc-400 text-sm flex flex-col space-y-3.5 font-sans">
              <Link to="/services" className="hover:text-white transition-colors w-max">Porcelain Veneers</Link>
              <Link to="/services" className="hover:text-white transition-colors w-max">Dental Implants</Link>
              <Link to="/services" className="hover:text-white transition-colors w-max">Clear Aligners</Link>
              <Link to="/services" className="hover:text-white transition-colors w-max">Smile Makeovers</Link>
              <Link to="/services" className="hover:text-white transition-colors w-max">Ceramic Crowns</Link>
            </nav>
          </div>

          {/* Contact & Hours (Col 10-12) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#DCA51B] mb-6 font-sans">
              CLINIC & HOURS
            </h4>
            <div className="text-zinc-400 text-sm space-y-4 font-sans">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#DCA51B] shrink-0 mt-1" />
                <span>123 Luxury Lane, Suite 100, Beverly Hills, CA 90210</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#DCA51B] shrink-0" />
                <span>+1 (310) 555-0199</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#DCA51B] shrink-0" />
                <span>concierge@kushdental.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#DCA51B] shrink-0 mt-1" />
                <span>Mon – Sat: 8:00 AM – 7:00 PM<br />Sunday: By Appointment</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 text-xs text-zinc-500 font-sans">
          <p>© {new Date().getFullYear()} Kush Dental Clinic. All Rights Reserved.</p>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
