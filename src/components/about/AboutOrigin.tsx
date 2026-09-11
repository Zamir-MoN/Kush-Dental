import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Sparkles } from 'lucide-react';

export const AboutOrigin = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="origin" ref={sectionRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
      <div className="luxury-card rounded-3xl p-6 sm:p-10 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          <div className="reveal-up order-2 lg:order-1 h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-md group">
            <img 
              alt="Doctor Consultation" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHPWq6rHGZhWi_EAVZKnyrDqxC5UaxXG3PTtPJ1NPs94Qq8_gJxu2Nf7ihqAKeaE8Y-4ySWjTmADWdX0oyYZbr_N1eesjqvhcXFQ9Y8eFL8GtB13MyWBkszZmP7N9RND9BU_teQHa6kPUao0o92Y6kRaQ3pcxwORMXePkTNBIdzYNKn7Xp_nhioAx57l65bschDeRAcJPAb0SYNfrrUhP8Ey2nQdqM-eN6vg9lP9PqBWvo74h65ES2"
            />
          </div>

          <div className="reveal-up order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#DCA51B]/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#DCA51B]" />
              <span className="text-[#DCA51B] text-xs font-bold tracking-widest uppercase font-sans">
                OUR ORIGIN
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-900 mb-6 leading-tight">
              Contemporary Care with a <span className="italic font-normal text-[#DCA51B]">Human Touch.</span>
            </h2>

            <p className="font-sans text-base text-zinc-600 mb-5 leading-relaxed font-light">
              Founded on the principle that healthcare should feel hospitable and tranquil, Kush Dental Clinic was born from a desire to transform the dental experience into a rejuvenating ritual of well-being.
            </p>

            <p className="font-sans text-base text-zinc-600 leading-relaxed font-light">
              We stripped away the cold, sterile clinical norms and rebuilt our practice around patient comfort, empathetic communication, and world-class digital precision.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
