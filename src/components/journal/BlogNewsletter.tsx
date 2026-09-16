import { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { AnimatedWaveContours } from '../common/AnimatedWaveContours';

export const BlogNewsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="relative my-20 overflow-hidden rounded-[32px] bg-[#121316] text-white p-8 sm:p-12 lg:p-16 border border-white/10 shadow-2xl">
      {/* Background Topographic Wave Contours (Exact multi-line water contour wave flow) */}
      <AnimatedWaveContours opacity="opacity-55" strokeColor="#DCA51B" strokeWidth={1.35} speed="water" />

      {/* Background Gold Ambient Glowing Core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-[#DCA51B]/15 rounded-full blur-[100px] pointer-events-none animate-newsletter-glow" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">


        <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white mb-4">
          Stay Ahead of Modern <br />
          <span className="italic text-[#DCA51B] font-light">Aesthetic Dentistry</span>.
        </h3>

        <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8 font-light">
          Join 2,400+ dentists, ceramists, and patients receiving our monthly digest of surgical breakthroughs, smile transformations, and clinical perspectives.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-3 bg-[#DCA51B]/20 border border-[#DCA51B] text-[#DCA51B] px-6 py-4 rounded-2xl animate-fade-in">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <span className="text-sm font-semibold text-white">
              Thank you for subscribing! You will receive our next monthly Clinical Digest.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="newsletter-email"
                name="newsletterEmail"
                aria-label="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 transition-all"
              />
            </div>
            <button
              type="submit"
              className="btn-gold-luxury px-6 py-3.5 text-xs whitespace-nowrap cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-zinc-500 mt-4">
          No spam, strictly clinical excellence. Unsubscribe at any time with one click.
        </p>
      </div>
    </div>
  );
};
