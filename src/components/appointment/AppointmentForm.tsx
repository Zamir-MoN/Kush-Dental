import { useRef, useState } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';

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
    <section ref={sectionRef} className="py-section-mobile md:py-section-desktop px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-light-gray">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-primary shadow-sm p-8 lg:p-16 rounded-3xl reveal-up">
          
          <div className="flex flex-col justify-center">
            <h2 className="font-display text-4xl lg:text-5xl mb-10 text-tertiary">Request an Appointment</h2>
            
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
          
          <div className="bg-soft-gray hidden lg:block rounded-sm overflow-hidden aspect-[4/3] relative">
            <img 
              alt="Clinic Location" 
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" 
              src="https://lh3.googleusercontent.com/aida/AEtjO1WYQqZ_UCMoxARL5IWMscsOQaAdYX7D91CBbcHQlCvVPmQpyYDFNsxaSq24nAxIQSyAQ8hSiMU_VPMWmci0T4JT6UBg3dHefVo0VEWM2ZPPWbDy9kfVkgvDGjPR5jnB4cW4Kpymrwu0UwGaeVrEut4L6P3AoUKuSEOCjbOSY5xxN8oF77uadePQV9Ffr0W6FRoP5U--ZF23tRDgs74RcIvILBx4YJmH0kcX7jyP3LYNEYTZa8IyChOTJe79" 
            />
            <div className="absolute inset-0 flex items-center justify-center p-16">
              <img 
                alt="Kush Dental Logo" 
                className="w-full h-full object-contain drop-shadow-xl" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcaaMSidbbW0QgyTOZ4cnlCVGyDd_BalPFwXIB_6KSj9GhKO8EYD70RMJv5Kk-JQWkIrUG8A8Az5av5lXT3T6t9Xv7lW7s9uYDfb0b118SE1MdnpEqFmA1XCvFcDBOe8lX4n9HXIppKXw0ls0UdNxyxdK-8ywExu52L9T3F8-qyrqouqJGrE6OxGepAbK3REvs42hePYjVAQ1Qm5j6GsEOLE6pdam7eRxKTjYOoowJu-_T8GGR0uSY-q0ZJFAHbxMaRYo" 
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
