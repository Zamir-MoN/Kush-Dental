import { useRef, useState } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { InteractiveClinicMap } from './InteractiveClinicMap';
import { Calendar, Clock, Phone, CheckCircle2 } from 'lucide-react';

export const AppointmentForm = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4500);
  };

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16 reveal-up">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-900 leading-tight mb-3 tracking-tight">
            Book Your Dental Visit
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base font-sans font-light leading-relaxed">
            Schedule your checkup, cleaning, or cosmetic consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white shadow-xl p-6 sm:p-10 lg:p-14 rounded-3xl reveal-up items-stretch border border-[#E8E2D5]">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {submitted ? (
              <div className="bg-[#FAF7F2] p-8 sm:p-12 rounded-3xl text-center border border-[#DCA51B]/40 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#DCA51B]/15 border border-[#DCA51B] flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-8 h-8 text-[#DCA51B]" />
                </div>
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-zinc-900 mb-3">Request Confirmed</h3>
                <p className="text-zinc-600 text-sm sm:text-base max-w-md font-sans leading-relaxed font-light">
                  Thank you! Our dental team will contact you shortly to confirm your appointment time.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 block mb-2 font-sans">
                    Full Name
                  </label>
                  <input 
                    required
                    placeholder="e.g. Eleanor Vance"
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-sm text-zinc-900 font-sans" 
                    type="text" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 block mb-2 font-sans">
                      Email Address
                    </label>
                    <input 
                      required
                      placeholder="eleanor@example.com"
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-sm text-zinc-900 font-sans" 
                      type="email" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 block mb-2 font-sans">
                      Phone Number
                    </label>
                    <input 
                      required
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-sm text-zinc-900 font-sans" 
                      type="tel" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 block mb-2 font-sans">
                    Desired Treatment / Consultation
                  </label>
                  <select className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-sm text-zinc-900 font-sans cursor-pointer">
                    <option>Routine Dental Checkup & Teeth Cleaning</option>
                    <option>Cosmetic Teeth Whitening & Porcelain Veneers</option>
                    <option>Dental Implants & Tooth Replacement</option>
                    <option>Clear Aligners & Teeth Straightening</option>
                    <option>Ceramic Dental Crowns & Fillings</option>
                    <option>Emergency Toothache & Pain Relief</option>
                  </select>
                </div>
                
                <button 
                  type="submit"
                  className="btn-gold-luxury w-full mt-2 cursor-pointer group"
                >
                  <Calendar className="w-4 h-4 text-[#141518] group-hover:rotate-12 transition-transform duration-300" />
                  <span>BOOK DENTAL APPOINTMENT</span>
                </button>
              </form>
            )}

            {/* Quick Clinic Info */}
            <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-[#E8E2D5] text-xs text-zinc-600 font-sans">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#DCA51B] shrink-0" />
                <span>Mon – Sat: 8:00 AM – 7:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#DCA51B] shrink-0" />
                <span>Direct: +1 (310) 555-0199</span>
              </div>
            </div>

          </div>
          
          {/* Right Column: Interactive Clinic Map */}
          <div className="lg:col-span-6 w-full flex flex-col justify-stretch min-h-[380px] lg:min-h-[460px]">
            <InteractiveClinicMap />
          </div>
          
        </div>
      </div>
    </section>
  );
};
