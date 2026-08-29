import { useRef, useState } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { InteractiveClinicMap } from './InteractiveClinicMap';

export const AppointmentForm = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section ref={sectionRef} className="py-section-mobile md:py-section-desktop px-4 sm:px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-light-gray">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-primary shadow-sm p-6 sm:p-10 lg:p-16 rounded-2xl sm:rounded-3xl reveal-up">
          
          <div className="flex flex-col justify-center">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-6 sm:mb-10 text-tertiary">Request an Appointment</h2>
            
            {submitted ? (
              <div className="bg-soft-gray p-8 rounded-sm text-center border border-border">
                <h3 className="font-display text-2xl text-secondary mb-2">Request Received</h3>
                <p className="text-neutral text-sm">Our concierge will contact you shortly to confirm your preferred time.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="label-small text-neutral block mb-2">Full Name</label>
                  <input 
                    required
                    className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-secondary transition-colors text-sm text-tertiary" 
                    type="text" 
                  />
                </div>
                <div>
                  <label className="label-small text-neutral block mb-2">Email Address</label>
                  <input 
                    required
                    className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-secondary transition-colors text-sm text-tertiary" 
                    type="email" 
                  />
                </div>
                <div>
                  <label className="label-small text-neutral block mb-2">Phone Number</label>
                  <input 
                    required
                    className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-secondary transition-colors text-sm text-tertiary" 
                    type="tel" 
                  />
                </div>
                <div>
                  <label className="label-small text-neutral block mb-2">Preferred Treatment</label>
                  <select className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-secondary transition-colors text-sm text-tertiary">
                    <option>Cosmetic Consultation</option>
                    <option>General Checkup</option>
                    <option>Implant Consultation</option>
                    <option>Clear Aligners</option>
                  </select>
                </div>
                
                <button 
                  type="submit"
                  className="bg-secondary text-primary label-small px-8 py-4 rounded hover:bg-[#c49216] transition-colors duration-300 cursor-hover shadow-sm w-full mt-4"
                >
                  Submit Request
                </button>
              </form>
            )}
          </div>
          
          {/* Right Column: 3D Reactive Interactive Map */}
          <div className="w-full flex">
            <InteractiveClinicMap />
          </div>
          
        </div>
      </div>
    </section>
  );
};
