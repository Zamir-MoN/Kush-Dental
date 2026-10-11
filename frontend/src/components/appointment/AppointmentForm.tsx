import { useRef, useState } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { apiClient } from '../../lib/apiClient';
import { Turnstile } from '@marsidev/react-turnstile';
import { InteractiveClinicMap } from './InteractiveClinicMap';
import { Phone, CheckCircle2, Mail } from 'lucide-react';

export const ContactForm = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const generateIdempotencyKey = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback UUID v4 generator using crypto.getRandomValues
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  };

  const [idempotencyKey, setIdempotencyKey] = useState<string>(generateIdempotencyKey);

  const handleFormChange = () => {
    setIdempotencyKey(generateIdempotencyKey());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      website_url: formData.get('website_url'),
      captcha_token: captchaToken
    };

    if (!captchaToken) {
      setError('Please wait for human verification to complete, or try reloading the page.');
      setLoading(false);
      return;
    }

    try {
      await apiClient('/api/v1/public/leads', {
        method: 'POST',
        data,
        skipAuth: true,
        headers: {
          'Idempotency-Key': idempotencyKey
        }
      });
      
      setSubmitted(true);
      // DO NOT reset form or success state - user must refresh page
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-18 xl:py-20 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 reveal-up">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-zinc-900 leading-tight mb-2 tracking-tight">
            Have Questions? Let's Talk
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm lg:text-base font-sans font-light leading-relaxed">
            We're here to help. Reach out for any inquiries or to discuss your dental needs.
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
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-zinc-900 mb-2">Inquiry Sent</h3>
                <p className="text-zinc-600 text-xs sm:text-sm max-w-md font-sans leading-relaxed font-light">
                  Thank you! Our dental team will contact you shortly to address your inquiry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} onChange={handleFormChange} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                    {error}
                  </div>
                )}
                
                {/* Honeypot field for anti-spam */}
                <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <label htmlFor="website_url">Website URL</label>
                  <input type="text" id="website_url" name="website_url" tabIndex={-1} autoComplete="off" />
                </div>
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
                      placeholder="9341131921"
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-xs sm:text-sm text-zinc-900 font-sans" 
                      type="tel" 
                    />
                  </div>
                </div>


                
                <button 
                  type="submit"
                  disabled={loading || !captchaToken}
                  className="btn-gold-solid w-full mt-2 cursor-pointer group py-3 text-xs disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  <Phone className="w-4 h-4 shrink-0 group-hover:rotate-12 transition-transform duration-300" />
                  <span>{loading ? 'SUBMITTING...' : 'SEND INQUIRY'}</span>
                </button>
                <Turnstile 
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
                  onSuccess={setCaptchaToken}
                  options={{ action: 'submit_appointment', size: 'invisible' }}
                />
              </form>
            )}

            {/* Quick Clinic Info */}
            <div className="flex flex-col sm:flex-row gap-6 pt-5 mt-5 border-t border-[#E8E2D5] text-[11px] sm:text-xs text-zinc-600 font-sans">
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#DCA51B] shrink-0" />
                  <span className="font-semibold text-zinc-800">Contact</span>
                </div>
                <div className="pl-5 text-zinc-600">9341131921</div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#DCA51B] shrink-0" />
                  <span className="font-semibold text-zinc-800">Email</span>
                </div>
                <div className="pl-5 text-zinc-600">bhdental23@gmail.com</div>
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
