import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Info, ArrowRight, CheckCircle2 } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
                          <input type="radio" name="treatment" defaultChecked={idx === 0} className="peer sr-only" />
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
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#DCA51B]/40 text-[#DCA51B] font-serif font-bold text-sm flex items-center justify-center">2</span>
                      <h2 className="font-serif text-2xl font-bold text-zinc-900">Select Date</h2>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center font-sans text-xs font-semibold mb-3 text-zinc-400 uppercase tracking-wider">
                      <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center font-sans text-sm">
                      <div className="p-2 text-zinc-300">28</div>
                      <div className="p-2 text-zinc-300">29</div>
                      <div className="p-2 text-zinc-300">30</div>
                      <div className="p-2 cursor-pointer hover:bg-[#DCA51B]/15 hover:text-[#DCA51B] rounded-xl transition-colors">1</div>
                      <div className="p-2 cursor-pointer bg-[#DCA51B] text-[#141518] rounded-xl font-bold shadow-sm transform hover:scale-105 transition-all">2</div>
                      <div className="p-2 cursor-pointer hover:bg-[#DCA51B]/15 hover:text-[#DCA51B] rounded-xl transition-colors">3</div>
                      <div className="p-2 cursor-pointer hover:bg-[#DCA51B]/15 hover:text-[#DCA51B] rounded-xl transition-colors">4</div>
                    </div>
                  </div>

                  <div className="w-px bg-[#E8E2D5] hidden md:block" />

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#DCA51B]/40 text-[#DCA51B] font-serif font-bold text-sm flex items-center justify-center">3</span>
                      <h2 className="font-serif text-2xl font-bold text-zinc-900">Preferred Time</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'].map((time, idx) => (
                        <label key={time} className="cursor-pointer group">
                          <input type="radio" name="time" defaultChecked={idx === 1} className="peer sr-only" />
                          <div className="text-center py-3 rounded-xl border border-[#E8E2D5] bg-[#FAF7F2]/50 peer-checked:border-[#DCA51B] peer-checked:text-[#141518] peer-checked:bg-[#DCA51B] peer-checked:font-bold font-sans text-xs sm:text-sm transition-all group-hover:border-[#DCA51B]/50 peer-checked:shadow-sm">
                            {time}
                          </div>
                        </label>
                      ))}
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
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-sans">Full Name</label>
                      <input required type="text" placeholder="Johnathan Doe" className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3.5 font-sans text-sm text-zinc-900 input-glow transition-all" />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-sans">Phone Number</label>
                      <input required type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3.5 font-sans text-sm text-zinc-900 input-glow transition-all" />
                    </div>
                    
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-sans">Email Address</label>
                      <input required type="email" placeholder="john@example.com" className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-4 py-3.5 font-sans text-sm text-zinc-900 input-glow transition-all" />
                    </div>

                  </div>

                  <button type="submit" className="btn-gold-luxury w-full mt-8 cursor-pointer group">
                    <span>CONFIRM APPOINTMENT REQUEST</span>
                    <ArrowRight className="w-4 h-4 text-[#141518] group-hover:translate-x-1.5 transition-transform duration-300" />
                  </button>
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
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday'].map(day => (
                <li key={day} className="flex justify-between items-center border-b border-[#E8E2D5] pb-2">
                  <span className="font-medium text-zinc-900">{day}</span>
                  <span>08:00 – 19:00</span>
                </li>
              ))}
              <li className="flex justify-between items-center border-b border-[#E8E2D5] pb-2">
                <span className="font-medium text-zinc-900">Friday</span>
                <span>08:00 – 18:00</span>
              </li>
              <li className="flex justify-between items-center border-b border-[#E8E2D5] pb-2">
                <span className="font-medium text-zinc-900">Saturday</span>
                <span>09:00 – 16:00</span>
              </li>
              <li className="flex justify-between items-center text-zinc-400">
                <span className="font-medium">Sunday</span>
                <span className="text-xs uppercase tracking-wider text-[#DCA51B]">By Concierge</span>
              </li>
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

