import React from 'react';
import { MapPin, Navigation, Phone, Clock } from 'lucide-react';

export const InteractiveClinicMap: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[480px] rounded-3xl overflow-hidden shadow-xl border border-border/40 flex flex-col bg-[#f0ede6]">
      
      {/* Real Interactive Map Frame */}
      <div className="relative w-full h-[240px] sm:h-[280px] md:h-[260px] lg:flex-1 min-h-[220px] overflow-hidden">
        <iframe
          title="Kush Dental Clinic Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
          className="w-full h-full border-0 absolute inset-0 grayscale-[25%] contrast-[1.05]"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        
        {/* Floating Clinic Pin Badge */}
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-white/80 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-display font-bold text-xs text-tertiary leading-tight">Kush Dental Clinic</p>
            <p className="text-[10px] text-neutral">Medical Arcade • Suite 402</p>
          </div>
        </div>
      </div>

      {/* Clean Bottom Info & Directions Bar */}
      <div className="bg-white p-5 border-t border-border/30 flex flex-col gap-3.5 shrink-0 z-20">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-display font-bold text-sm sm:text-base text-tertiary">Kush Dental Clinic & Aesthetics</h4>
            <p className="text-neutral text-xs">Suite 402, High Street Medical Arcade</p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            Open Today
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/30 pt-2.5 text-neutral">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>09:00 AM – 07:00 PM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>+1 (800) 587-4336</span>
          </div>
        </div>

        <div className="pt-1 pb-1">
          <a 
            href="https://maps.google.com/?q=Dental+Clinic" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-secondary text-primary font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#c49216] transition-all duration-300 shadow-sm active:scale-[0.98] text-center"
          >
            <Navigation className="w-3.5 h-3.5 shrink-0" /> Get Directions on Google Maps
          </a>
        </div>
      </div>

    </div>
  );
};
