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
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-18 xl:py-20 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 reveal-up">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-zinc-900 leading-tight mb-2 tracking-tight">
            Book Your Dental Visit
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm lg:text-base font-sans font-light leading-relaxed">
            Schedule your checkup, cleaning, or cosmetic consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 bg-white shadow-xl p-5 sm:p-7 lg:p-10 rounded-3xl reveal-up items-stretch border border-[#E8E2D5]">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {submitted ? (
              <div className="bg-[#FAF7F2] p-6 sm:p-10 rounded-3xl text-center border border-[#DCA51B]/40 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#DCA51B]/15 border border-[#DCA51B] flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-7 h-7 text-[#DCA51B]" />
                </div>
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-zinc-900 mb-2">Request Confirmed</h3>
                <p className="text-zinc-600 text-xs sm:text-sm max-w-md font-sans leading-relaxed font-light">
                  Thank you! Our dental team will contact you shortly to confirm your appointment time.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="appointment-full-name" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5 font-sans">
                    Full Name
                  </label>
                  <input 
                    id="appointment-full-name"
                    name="fullName"
                    aria-label="Full Name"
                    required
                    placeholder="e.g. Eleanor Vance"
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-xs sm:text-sm text-zinc-900 font-sans" 
                    type="text" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="appointment-email" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5 font-sans">
                      Email Address
                    </label>
                    <input 
                      id="appointment-email"
                      name="email"
                      aria-label="Email Address"
                      required
                      placeholder="eleanor@example.com"
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-xs sm:text-sm text-zinc-900 font-sans" 
                      type="email" 
                    />
                  </div>
                  <div>
                    <label htmlFor="appointment-phone" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5 font-sans">
                      Phone Number
                    </label>
                    <input 
                      id="appointment-phone"
                      name="phone"
                      aria-label="Phone Number"
                      required
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-xs sm:text-sm text-zinc-900 font-sans" 
                      type="tel" 
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="appointment-treatment-select" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5 font-sans">
                    Desired Treatment / Consultation
                  </label>
                  <select 
                    id="appointment-treatment-select"
                    name="desiredTreatment"
                    aria-label="Desired Treatment or Consultation"
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-xs sm:text-sm text-zinc-900 font-sans cursor-pointer"
                  >
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
                  className="btn-gold-luxury w-full mt-2 cursor-pointer group py-3 text-xs"
                >
                  <Calendar className="w-4 h-4 text-[#141518] group-hover:rotate-12 transition-transform duration-300" />
                  <span>BOOK DENTAL APPOINTMENT</span>
                </button>
              </form>
            )}

            {/* Quick Clinic Info */}
            <div className="grid grid-cols-2 gap-4 pt-5 mt-5 border-t border-[#E8E2D5] text-[11px] sm:text-xs text-zinc-600 font-sans">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#DCA51B] shrink-0" />
                <span>Mon – Sat: 8:00 AM – 7:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#DCA51B] shrink-0" />
                <span>Direct: +1 (310) 555-0199</span>
              </div>
            </div>

          </div>
          
          {/* Right Column: Interactive Clinic Map */}
          <div className="lg:col-span-6 w-full flex flex-col justify-stretch min-h-[280px] sm:min-h-[320px] lg:min-h-[380px]">
            <InteractiveClinicMap />
          </div>
          
        </div>
      </div>
    </section>
  );
};
