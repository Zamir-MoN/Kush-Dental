import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Info, ArrowRight } from 'lucide-react';
import StaggeredMenu from '../components/ui/StaggeredMenu';

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const Booking = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const staggeredMenuItems = [
    { label: 'Services', ariaLabel: 'Go to services', link: '/#services' },
    { label: 'About Us', ariaLabel: 'Learn about us', link: '/#about' },
    { label: 'Blog', ariaLabel: 'Read our blog', link: '/#blog' },
    { label: 'Case Studies', ariaLabel: 'View case studies', link: '/#case-studies' },
    { label: 'Book Visit', ariaLabel: 'Book an appointment', link: '/book' }
  ];

  return (
    <div className="text-on-surface antialiased min-h-screen flex flex-col relative overflow-x-hidden bg-background">
      {/* Header */}
      <header className="w-full bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/20 py-4 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop sticky top-0 z-50 transition-colors">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 md:gap-4 hover:opacity-80 transition-opacity duration-300">
            <img src="/images/logo.png" alt="Kush Dental Logo" className="h-8 md:h-10 w-auto object-contain" />
            <span className="font-display font-bold text-xl md:text-2xl text-tertiary">Kush Dental Clinic</span>
          </Link>

        </div>
      </header>

      <div className="md:hidden z-[100] relative">
        <StaggeredMenu
          position="right"
          items={staggeredMenuItems}
          displaySocials={false}
          colors={['#DCA51B', '#EAE8E6']}
          menuButtonColor="#111111"
          openMenuButtonColor="#111111"
          accentColor="#DCA51B"
          isFixed={true}
        />
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-stack-lg flex flex-col lg:flex-row gap-stack-lg relative z-10 pt-12">
        
        {/* Booking Flow (Left Canvas) */}
        <div className="flex-grow flex flex-col gap-stack-lg">
          <Reveal className="flex flex-col gap-stack-sm mb-8">
            <Link to="/" className="flex items-center gap-2 group w-fit mb-4">
              <ArrowLeft className="w-5 h-5 text-secondary transition-transform group-hover:-translate-x-1" />
              <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-secondary transition-colors">Back to Home</span>
            </Link>
            <h1 className="font-display-lg text-4xl md:text-5xl lg:text-[56px] text-on-surface font-bold mb-4">Book Your Visit</h1>
            <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">
              Please select your preferred treatment, doctor, and time. Appointments are highly recommended before visiting.
            </p>
          </Reveal>

          <form className="flex flex-col gap-6">
            
            {/* Step 1: Treatment */}
            <Reveal delay={0.1}>
              <div className="bg-surface-container-lowest/90 backdrop-blur-sm rounded-2xl border border-outline-variant/20 p-5 md:p-8 ambient-shadow transition-all hover:shadow-lg">
                <h2 className="font-headline-md text-2xl font-semibold mb-6">1. Select Treatment</h2>
                <div className="flex flex-wrap gap-4">
                  {['Consultation', 'Cleaning', 'Root Canal', 'Whitening'].map((treatment, idx) => (
                    <label key={treatment} className="cursor-pointer relative group">
                      <input type="radio" name="treatment" defaultChecked={idx === 0} className="peer sr-only" />
                      <div className="px-6 py-3 rounded-full bg-on-surface/5 text-on-surface font-label-md text-sm font-medium peer-checked:bg-secondary peer-checked:text-white transition-all transform group-hover:scale-105 peer-checked:shadow-md">
                        {treatment}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Step 2: Doctor */}
            <Reveal delay={0.2}>
              <div className="bg-surface-container-lowest/90 backdrop-blur-sm rounded-2xl border border-outline-variant/20 p-5 md:p-8 ambient-shadow transition-all hover:shadow-lg">
                <h2 className="font-headline-md text-2xl font-semibold mb-6">2. Choose Doctor</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <label className="cursor-pointer group">
                    <input type="radio" name="doctor" defaultChecked className="peer sr-only" />
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/20 peer-checked:border-secondary peer-checked:bg-secondary/5 transition-all transform group-hover:-translate-y-1 group-hover:shadow-md peer-checked:shadow-lg">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-variant flex-shrink-0 transition-transform group-hover:scale-110">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0PKZoVXGwhOqobnN3B1r0-zrIhbWmwFsJqIKJTbTv4ZR9ertRYNizSWAhTxAbgnqjEJR2fHsV_xPhm_0MkfFUO46oSKyRbLMNHTXbZcJJcS_fCAh-u3qihMsBzkRoSnnac8Hijmdlp9tt3gFX_bAQ-5bfaLIfdp6SBxF1FXu-8rJktt-y9oItKXqS-U6XpB0b6S3guqU1yoDnT8MGJHh3Z18ykywiPpdq5YzF8e3YOg3kutMfbcPw" 
                          alt="Dr. Amit" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-label-md text-lg text-on-surface font-semibold">Dr. Amit</h3>
                        <p className="font-body-md text-sm text-on-surface-variant">Lead Prosthodontist</p>
                      </div>
                      <CheckCircle className="w-6 h-6 ml-auto text-outline-variant peer-checked:text-secondary transition-colors" />
                    </div>
                  </label>

                  <label className="cursor-pointer group">
                    <input type="radio" name="doctor" className="peer sr-only" />
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/20 peer-checked:border-secondary peer-checked:bg-secondary/5 transition-all transform group-hover:-translate-y-1 group-hover:shadow-md peer-checked:shadow-lg">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-variant flex-shrink-0 transition-transform group-hover:scale-110">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQJXUI7uFJzZeLK5u47ji0smjTpnWbB-XTeXGtkhoon7OiBdJuAKhYuPUre2gzk36QTuutUVUob3E5IO2Ffb7B_GlBUMg7ZCGOu_Qbn0pfoLKqiluDye2tkAXN9eIjs1wWciWjbyX7AI2_9l0wxk5XAGXj99iBi6kIwwuCjomGVzKnzZGE46s_7RLLtDhpB9qx_YBo3V352azRxleOvqWd0eOK8JI3mmaW5OHOMWkinnB4x8WU7wgS" 
                          alt="Dr. Aishwarya" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-label-md text-lg text-on-surface font-semibold">Dr. Aishwarya</h3>
                        <p className="font-body-md text-sm text-on-surface-variant">Cosmetic Specialist</p>
                      </div>
                      <CheckCircle className="w-6 h-6 ml-auto text-outline-variant peer-checked:text-secondary transition-colors" />
                    </div>
                  </label>

                </div>
              </div>
            </Reveal>

            {/* Step 3 & 4: Date and Time */}
            <Reveal delay={0.3}>
              <div className="bg-surface-container-lowest/90 backdrop-blur-sm rounded-2xl border border-outline-variant/20 p-5 md:p-8 ambient-shadow transition-all flex flex-col md:flex-row gap-8 hover:shadow-lg">
                <div className="flex-1">
                  <h2 className="font-headline-md text-2xl font-semibold mb-6">3. Select Date</h2>
                  <div className="grid grid-cols-7 gap-2 text-center font-label-sm text-xs font-semibold mb-4 text-on-surface-variant">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center font-body-md text-base">
                    <div className="p-2 text-outline-variant">28</div>
                    <div className="p-2 text-outline-variant">29</div>
                    <div className="p-2 text-outline-variant">30</div>
                    <div className="p-2 cursor-pointer hover:bg-secondary/10 hover:text-secondary rounded-full transition-colors">1</div>
                    <div className="p-2 cursor-pointer bg-secondary text-white rounded-full font-semibold shadow-md transform hover:scale-110 transition-all">2</div>
                    <div className="p-2 cursor-pointer hover:bg-secondary/10 hover:text-secondary rounded-full transition-colors">3</div>
                    <div className="p-2 cursor-pointer hover:bg-secondary/10 hover:text-secondary rounded-full transition-colors">4</div>
                  </div>
                </div>

                <div className="w-px bg-outline-variant/20 hidden md:block"></div>

                <div className="flex-1">
                  <h2 className="font-headline-md text-2xl font-semibold mb-6">4. Choose Time</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {['09:00 AM', '10:30 AM', '02:00 PM'].map((time, idx) => (
                      <label key={time} className="cursor-pointer group">
                        <input type="radio" name="time" defaultChecked={idx === 1} className="peer sr-only" />
                        <div className="text-center py-3 rounded-lg border border-outline-variant/20 peer-checked:border-secondary peer-checked:text-secondary peer-checked:bg-secondary/5 font-label-md text-sm font-medium transition-all group-hover:border-secondary/50 group-hover:bg-secondary/5 peer-checked:shadow-sm">
                          {time}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Step 5: Details */}
            <Reveal delay={0.4}>
              <div className="bg-surface-container-lowest/90 backdrop-blur-sm rounded-2xl border border-outline-variant/20 p-5 md:p-8 ambient-shadow transition-all hover:shadow-lg">
                <h2 className="font-headline-md text-2xl font-semibold mb-6">5. Patient Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="flex flex-col gap-2 group focus-within:translate-x-1 transition-transform">
                    <label className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-wider group-focus-within:text-secondary transition-colors">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-surface-container-lowest/80 border border-[#787776] rounded-xl px-4 py-3 font-body-md text-base input-glow transition-all" />
                  </div>
                  
                  <div className="flex flex-col gap-2 group focus-within:translate-x-1 transition-transform">
                    <label className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-wider group-focus-within:text-secondary transition-colors">Phone Number</label>
                    <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-surface-container-lowest/80 border border-[#787776] rounded-xl px-4 py-3 font-body-md text-base input-glow transition-all" />
                  </div>
                  
                  <div className="flex flex-col gap-2 md:col-span-2 group focus-within:translate-x-1 transition-transform">
                    <label className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-wider group-focus-within:text-secondary transition-colors">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-surface-container-lowest/80 border border-[#787776] rounded-xl px-4 py-3 font-body-md text-base input-glow transition-all" />
                  </div>

                </div>

                <button type="button" className="mt-8 w-full bg-secondary text-white font-label-md text-base font-semibold py-4 rounded-xl hover:opacity-90 hover:shadow-xl hover:shadow-secondary/20 transform hover:-translate-y-1 transition-all flex justify-center items-center gap-2 group">
                  <span>Confirm Appointment</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </button>
              </div>
            </Reveal>

          </form>
        </div>

        {/* Sidebar */}
        <Reveal delay={0.2} className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          <div className="bg-surface-container-lowest/90 backdrop-blur-sm rounded-2xl border border-outline-variant/20 p-8 sticky top-24 hover:shadow-lg transition-shadow">
            
            <div className="flex items-center gap-3 mb-6">
              <Clock className="text-secondary w-8 h-8" />
              <h3 className="font-headline-md text-xl font-semibold text-on-surface">Clinic Hours</h3>
            </div>
            
            <ul className="flex flex-col gap-4 font-body-md text-sm text-on-surface-variant">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday'].map(day => (
                <li key={day} className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                  <span className="font-medium">{day}</span>
                  <span>09:00 - 18:00</span>
                </li>
              ))}
              <li className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                <span className="font-medium">Friday</span>
                <span>09:00 - 17:00</span>
              </li>
              <li className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                <span className="font-medium">Saturday</span>
                <span>10:00 - 14:00</span>
              </li>
              <li className="flex justify-between items-center text-outline">
                <span className="font-medium">Sunday</span>
                <span>Closed</span>
              </li>
            </ul>

            <div className="mt-8 p-4 bg-secondary/5 rounded-xl border border-secondary/20 flex gap-3 hover:bg-secondary/10 transition-colors">
              <Info className="text-secondary w-5 h-5 shrink-0" />
              <p className="font-label-sm text-xs font-medium text-on-surface-variant leading-relaxed">
                Appointments are highly recommended before visiting to ensure minimal wait times.
              </p>
            </div>
            
          </div>
        </Reveal>

      </main>
    </div>
  );
};
