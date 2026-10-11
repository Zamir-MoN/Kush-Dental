import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, CheckCircle2, AlertTriangle } from 'lucide-react';
import { apiClient } from '../lib/apiClient';
import { Turnstile } from '@marsidev/react-turnstile';

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const UrgentVisit = () => {
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
      problemDescription: formData.get('problemDescription'),
      startedWhen: formData.get('startedWhen') || undefined,
      preferredContactMethod: formData.get('preferredContactMethod') || undefined,
      website_url: formData.get('website_url'),
      captcha_token: captchaToken
    };

    if (!captchaToken) {
      setError('Please wait for human verification to complete, or try reloading the page.');
      setLoading(false);
      return;
    }

    try {
      await apiClient('/api/v1/public/urgent-visits', {
        method: 'POST',
        data,
        skipAuth: true,
        headers: {
          'Idempotency-Key': idempotencyKey
        }
      });
      
      setSubmitted(true);
      // DO NOT automatically redirect or reset the form
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-12 flex flex-col relative z-10 pt-28 md:pt-36 pb-24">
        
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-8">
          <Reveal className="flex flex-col mb-4">
            <Link to="/" className="inline-flex items-center gap-2 group w-fit mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-[#DCA51B] transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#DCA51B] transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 shrink-0" />
              <h1 className="font-serif text-4xl sm:text-5xl text-zinc-900 leading-[1.1]">
                Urgent Dental Visit
              </h1>
            </div>
            
            <p className="text-zinc-600 text-sm sm:text-base font-sans font-light max-w-2xl leading-relaxed mb-4">
              If you are experiencing severe dental pain, a broken tooth, or other dental emergencies, please submit an urgent request. Our team will review it and contact you immediately during clinic hours.
            </p>

            <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E8E2D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-zinc-700 font-medium">Looking for a routine checkup or specific treatment?</p>
              <Link to="/book" className="text-xs font-bold uppercase tracking-widest text-[#DCA51B] hover:text-zinc-900 transition-colors border border-[#DCA51B] px-5 py-2.5 rounded-xl text-center whitespace-nowrap">
                Go to Normal Booking
              </Link>
            </div>
          </Reveal>

          {submitted ? (
            <Reveal>
              <div className="luxury-card rounded-3xl p-8 sm:p-14 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500 flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-8 h-8 text-rose-500" />
                </div>
                <h2 className="font-serif font-bold text-3xl text-zinc-900 mb-3">Urgent Request Received</h2>
                <p className="text-zinc-600 text-base max-w-lg font-sans leading-relaxed font-light mb-8">
                  Your urgent visit request has been successfully submitted. Our clinic staff will review your information and contact you as soon as possible to arrange care.
                </p>
                <Link to="/" className="btn-gold-luxury">
                  <span>RETURN TO HOME</span>
                </Link>
              </div>
            </Reveal>
          ) : (
            <form onSubmit={handleSubmit} onChange={handleFormChange} className="flex flex-col gap-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 text-center font-medium">
                  {error}
                </div>
              )}
              
              {/* Honeypot field for anti-spam */}
              <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <label htmlFor="booking_website_url">Website URL</label>
                <input type="text" id="booking_website_url" name="website_url" tabIndex={-1} autoComplete="off" />
              </div>
              
              <Reveal delay={0.1}>
                <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-5">
                  <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-4">Your Details</h2>
                  
                  <div>
                    <label htmlFor="fullName" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5 font-sans">
                      Full Name *
                    </label>
                    <input 
                      id="fullName"
                      name="fullName"
                      required
                      minLength={2}
                      maxLength={100}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-sm text-zinc-900 font-sans" 
                      type="text" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5 font-sans">
                        Email Address *
                      </label>
                      <input 
                        id="email"
                        name="email"
                        required
                        pattern="^[^@]+@[^@]+\.[^@]+$"
                        maxLength={100}
                        placeholder="john@example.com"
                        className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-sm text-zinc-900 font-sans" 
                        type="email" 
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5 font-sans">
                        Phone Number *
                      </label>
                      <input 
                        id="phone"
                        name="phone"
                        required
                        minLength={7}
                        maxLength={20}
                        pattern="^\+?[\d\s\-\(\)]+$"
                        placeholder="9341131921"
                        className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-sm text-zinc-900 font-sans" 
                        type="tel" 
                      />
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-5">
                  <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-4">Emergency Details</h2>
                  
                  <div>
                    <label htmlFor="problemDescription" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5 font-sans">
                      Problem Description *
                    </label>
                    <textarea 
                      id="problemDescription"
                      name="problemDescription"
                      required
                      minLength={5}
                      maxLength={5000}
                      rows={4}
                      placeholder="Please describe your dental emergency (e.g., broken tooth, severe pain, swelling)..."
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-sm text-zinc-900 font-sans resize-y" 
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="startedWhen" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5 font-sans">
                        When did this start? (Optional)
                      </label>
                      <input 
                        id="startedWhen"
                        name="startedWhen"
                        maxLength={200}
                        placeholder="e.g. 2 hours ago, yesterday morning"
                        className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-sm text-zinc-900 font-sans" 
                        type="text" 
                      />
                    </div>
                    <div>
                      <label htmlFor="preferredContactMethod" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5 font-sans">
                        Preferred Contact Method (Optional)
                      </label>
                      <select 
                        id="preferredContactMethod"
                        name="preferredContactMethod"
                        className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all text-sm text-zinc-900 font-sans appearance-none" 
                      >
                        <option value="">Any</option>
                        <option value="Phone Call">Phone Call</option>
                        <option value="Text Message">Text Message</option>
                        <option value="Email">Email</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex flex-col items-center gap-6 mt-4">
                  <Turnstile 
                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
                    onSuccess={setCaptchaToken}
                    options={{ action: 'submit_urgent_visit', size: 'invisible' }}
                  />
                  
                  <button 
                    type="submit"
                    disabled={loading || !captchaToken}
                    className="btn-gold-luxury w-full max-w-md cursor-pointer group py-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Phone className="w-5 h-5 text-[#141518] group-hover:rotate-12 transition-transform duration-300" />
                    <span>{loading ? 'SUBMITTING...' : 'REQUEST URGENT VISIT'}</span>
                  </button>
                  
                  <p className="text-xs text-zinc-500 font-sans text-center max-w-md">
                    By submitting this form, you request an urgent contact from our clinic. This does not guarantee an immediate appointment or medical advice.
                  </p>
                </div>
              </Reveal>

            </form>
          )}
        </div>
    </main>
  );
};
