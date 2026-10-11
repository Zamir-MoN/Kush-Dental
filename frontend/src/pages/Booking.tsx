import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Info, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '../lib/apiClient';
import { Turnstile } from '@marsidev/react-turnstile';
import { CLINIC_HOURS, formatTime12Hour } from '../lib/clinicHours';
import { 
  ToothSparkleIcon, 
  DentalMirrorIcon, 
  SmileCurveIcon, 
  DentalImplantIcon, 
  DentalCrownIcon, 
  ToothIcon 
} from '../components/common/DentalIcons';

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

const treatmentOptions = [
  { name: 'Routine Dental Checkup', icon: DentalMirrorIcon },
  { name: 'Cosmetic Veneers', icon: SmileCurveIcon },
  { name: 'Teeth Whitening', icon: ToothSparkleIcon },
  { name: 'Dental Implants', icon: DentalImplantIcon },
  { name: 'Clear Aligners', icon: DentalCrownIcon },
  { name: 'Emergency Toothache', icon: ToothIcon }
];

export const Booking = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  });
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');

  const generateCalendar = (baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarDays = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      calendarDays.push(new Date(year, month - 1, prevMonthLastDay - i, 0, 0, 0, 0));
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(new Date(year, month, i, 0, 0, 0, 0));
    }
    
    const trailingDays = (7 - (calendarDays.length % 7)) % 7;
    for (let i = 1; i <= trailingDays; i++) {
      calendarDays.push(new Date(year, month + 1, i, 0, 0, 0, 0));
    }
    
    return calendarDays;
  };
  
  // Use standard crypto.randomUUID() where supported, fallback if needed
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36));

  const handleFormChange = () => {
    if (crypto.randomUUID) {
      setIdempotencyKey(crypto.randomUUID());
    } else {
      setIdempotencyKey(Math.random().toString(36).substring(2) + Date.now().toString(36));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const startsAt = new Date(selectedDate);
    const [time, period] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    startsAt.setHours(hours, minutes, 0, 0);
    const data = {
      name: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      desiredTreatment: formData.get('treatment') || 'Consultation',
      website_url: formData.get('website_url'),
      captcha_token: captchaToken,
      startsAt: startsAt.toISOString()
    };

    if (!captchaToken) {
      setError('Please wait for human verification to complete, or try reloading the page.');
      setLoading(false);
      return;
    }

    try {
      await apiClient('/api/v1/public/appointments', {
        method: 'POST',
        data,
        skipAuth: true,
        headers: {
          'Idempotency-Key': idempotencyKey
        }
      });
      
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4500);
      form.reset();
      handleFormChange(); // regenerate for future bookings
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-12 flex flex-col lg:flex-row gap-10 lg:gap-12 relative z-10 pt-28 md:pt-36 pb-24">
        
        {/* Booking Flow (Left Canvas) */}
        <div className="flex-grow flex flex-col gap-8">
          <Reveal className="flex flex-col mb-4">
            <Link to="/" className="inline-flex items-center gap-2 group w-fit mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-[#DCA51B] transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#DCA51B] transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] text-zinc-900 leading-[1.1] mb-3">
              Book Your Dental Visit<span className="text-[#DCA51B]">.</span>
            </h1>
            <p className="text-zinc-600 text-sm sm:text-base font-sans font-light max-w-2xl leading-relaxed">
              Choose your treatment and pick a convenient appointment date and time with Dr. Amit Kumar.
            </p>
          </Reveal>

          {submitted ? (
            <Reveal>
              <div className="luxury-card rounded-3xl p-8 sm:p-14 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#DCA51B]/15 border border-[#DCA51B] flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-8 h-8 text-[#DCA51B]" />
                </div>
                <h2 className="font-serif font-bold text-3xl text-zinc-900 mb-3">Appointment Requested</h2>
                <p className="text-zinc-600 text-base max-w-lg font-sans leading-relaxed font-light mb-8">
                  Thank you! Our dental team has received your request and will contact you promptly to confirm your appointment.
                </p>
                <Link to="/" className="btn-gold-luxury">
                  <span>RETURN TO HOME</span>
                </Link>
              </div>
            </Reveal>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
              
              {/* Step 1: Treatment */}
              <Reveal delay={0.1}>
                <div className="luxury-card rounded-3xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#DCA51B]/40 text-[#DCA51B] font-serif font-bold text-sm flex items-center justify-center">1</span>
                    <h2 className="font-serif text-2xl font-bold text-zinc-900">Select Treatment</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {treatmentOptions.map((treatment, idx) => {
                      const Icon = treatment.icon;
                      return (
                        <label key={treatment.name} className="cursor-pointer relative group">
                          <input type="radio" name="treatment" value={treatment.name} defaultChecked={idx === 0} className="peer sr-only" />
                          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF7F2] text-zinc-700 font-sans text-xs sm:text-sm font-medium border border-[#E8E2D5] peer-checked:border-[#DCA51B] peer-checked:bg-[#DCA51B] peer-checked:text-[#141518] peer-checked:font-bold transition-all transform group-hover:scale-[1.02] peer-checked:shadow-md">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{treatment.name}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </Reveal>

              {/* Step 2 & 3: Date and Time */}
              <Reveal delay={0.2}>
                <div className="luxury-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#DCA51B]/40 text-[#DCA51B] font-serif font-bold text-sm flex items-center justify-center">2</span>
                        <h2 className="font-serif text-2xl font-bold text-zinc-900">Select Date</h2>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4">
                        <button 
                          type="button" 
                          aria-label="Previous month"
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                          className="p-1 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-500"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-sans font-semibold text-sm text-zinc-700 min-w-[110px] text-center" data-testid="month-year-header">
                          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button 
                          type="button" 
                          aria-label="Next month"
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                          className="p-1 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-500"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center font-sans text-xs font-semibold mb-3 text-zinc-400 uppercase tracking-wider">
                      <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center font-sans text-sm mb-4">
                      {generateCalendar(currentMonth).map((date) => {
                        const isSelected = selectedDate.getTime() === date.getTime();
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const isPast = date < today;
                        const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                        return (
                          <button
                            type="button"
                            key={date.toISOString()}
                            data-testid={isSelected ? "selected-date" : undefined}
                            disabled={isPast}
                            aria-label={date.toDateString()}
                            aria-current={isSelected ? "date" : undefined}
                            onClick={() => {
                              if (!isPast) {
                                setSelectedDate(date);
                                if (!isCurrentMonth) {
                                  setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                                }
                              }
                            }}
                            className={`p-2 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DCA51B] focus-visible:ring-inset ${
                              isPast 
                                ? 'text-zinc-300 cursor-not-allowed opacity-50'
                                : 'cursor-pointer'
                            } ${
                              isSelected 
                                ? 'bg-[#DCA51B] text-[#141518] font-bold shadow-sm transform hover:scale-105' 
                                : !isPast
                                  ? `hover:bg-[#DCA51B]/15 hover:text-[#DCA51B] ${!isCurrentMonth ? 'text-zinc-400' : 'text-zinc-700'}`
                                  : ''
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-sm font-sans text-zinc-500 font-medium bg-[#FAF7F2] py-2 px-3 rounded-lg inline-block">
                      Selected: <span className="text-zinc-900 font-semibold" data-testid="selected-date-summary">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="w-px bg-[#E8E2D5] hidden md:block" />

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#DCA51B]/40 text-[#DCA51B] font-serif font-bold text-sm flex items-center justify-center">3</span>
                      <h2 className="font-serif text-2xl font-bold text-zinc-900">Preferred Time</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'].map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <label key={time} className="cursor-pointer group relative">
                            <input type="radio" name="time" value={time} checked={isSelected} onChange={() => setSelectedTime(time)} className="peer sr-only" />
                            <div className={`text-center py-3 rounded-xl border font-sans text-xs sm:text-sm transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[#DCA51B] peer-focus-visible:ring-inset ${
                              isSelected 
                                ? 'border-[#DCA51B] text-[#141518] bg-[#DCA51B] font-bold shadow-sm'
                                : 'border-[#E8E2D5] bg-[#FAF7F2]/50 group-hover:border-[#DCA51B]/50'
                            }`}>
                              {time}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Step 4: Details */}
              <Reveal delay={0.3}>
                <div className="luxury-card rounded-3xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#DCA51B]/40 text-[#DCA51B] font-serif font-bold text-sm flex items-center justify-center">4</span>
                    <h2 className="font-serif text-2xl font-bold text-zinc-900">Patient Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    <div className="flex flex-col gap-2">
                      <label htmlFor="booking-full-name" className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-sans">Full Name</label>
                      <input id="booking-full-name" name="fullName" aria-label="Full Name" required type="text" placeholder="Johnathan Doe" className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3.5 font-sans text-sm text-zinc-900 input-glow transition-all" />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label htmlFor="booking-phone" className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-sans">Phone Number</label>
                      <input id="booking-phone" name="phone" aria-label="Phone Number" required type="tel" placeholder="9341131921" className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3.5 font-sans text-sm text-zinc-900 input-glow transition-all" />
                    </div>
                    
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label htmlFor="booking-email" className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-sans">Email Address</label>
                      <input id="booking-email" name="email" aria-label="Email Address" required type="email" placeholder="john@example.com" className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3.5 font-sans text-sm text-zinc-900 input-glow transition-all" />
                    </div>

                  </div>

                  <button type="submit" disabled={loading || !captchaToken} className="btn-gold-luxury w-full mt-8 cursor-pointer group disabled:opacity-70 disabled:cursor-not-allowed">
                    <span>{loading ? 'SUBMITTING...' : 'SUBMIT APPOINTMENT REQUEST'}</span>
                    {!loading && <ArrowRight className="w-4 h-4 text-[#141518] group-hover:translate-x-1.5 transition-transform duration-300" />}
                  </button>
                  <Turnstile 
                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
                    onSuccess={setCaptchaToken}
                    options={{ action: 'submit_appointment', size: 'invisible' }}
                  />
                </div>
              </Reveal>

            </form>
          )}
        </div>

        {/* Sidebar */}
        <Reveal delay={0.2} className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          <div className="luxury-card rounded-3xl p-6 sm:p-8 sticky top-28">
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center text-[#DCA51B]">
                <Clock className="w-5 h-5 icon-subtle-pulse" />
              </div>
              <h3 className="font-serif text-xl font-bold text-zinc-900">Clinic Hours</h3>
            </div>
            
            <ul className="flex flex-col gap-3.5 font-sans text-xs sm:text-sm text-zinc-600">
              {CLINIC_HOURS.map((clinicDay) => (
                <li key={clinicDay.day} className="flex justify-between items-center border-b border-[#E8E2D5] pb-2 last:border-b-0 last:pb-0">
                  <span className={`font-medium ${clinicDay.isConcierge ? 'text-zinc-400' : 'text-zinc-900'}`}>{clinicDay.day}</span>
                  {clinicDay.isConcierge ? (
                    <span className="text-xs uppercase tracking-wider text-[#DCA51B]">By Concierge</span>
                  ) : (
                    <span>{formatTime12Hour(clinicDay.open!)} – {formatTime12Hour(clinicDay.close!)}</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-8 p-4 bg-[#FAF7F2] rounded-2xl border border-[#DCA51B]/25 flex gap-3">
              <Info className="text-[#DCA51B] w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-sans text-xs text-zinc-600 leading-relaxed font-light">
                Private reserved parking is available directly behind our clinical pavilion for all scheduled visits.
              </p>
            </div>
            
          </div>
        </Reveal>

      </main>
  );
};

export default Booking;

