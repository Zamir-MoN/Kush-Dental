import { motion } from 'framer-motion';
import { testimonials } from '../../data';
import { Star, CheckCircle2 } from 'lucide-react';

export const PatientStories = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-18 xl:py-20 bg-[#FAF7F2] border-y border-[#E8E2D5] overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 mb-8 sm:mb-10 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-zinc-900 leading-tight mb-2 tracking-tight">
          Patient Stories
        </h2>
        <p className="text-zinc-600 text-xs sm:text-sm lg:text-base font-sans font-light max-w-xl mx-auto leading-relaxed">
          Real feedback from patients who trust Kush Dental Clinic.
        </p>
      </div>

      <div className="relative">
        <motion.div 
          className="flex gap-5 px-4 sm:px-6 lg:px-12 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 35, repeat: Infinity }}
        >
          {[...testimonials, ...testimonials, ...testimonials].map((testimonial, i) => (
            <motion.div 
              key={i}
              className="w-[280px] sm:w-[320px] shrink-0 luxury-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between group cursor-default"
              whileHover={{ y: -4 }}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex gap-1 text-[#DCA51B]">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#DCA51B] text-[#DCA51B] transition-transform duration-300 group-hover:scale-110" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified Patient</span>
                  </div>
                </div>

                <p className="text-zinc-700 text-sm sm:text-base leading-relaxed mb-6 font-sans italic font-normal">
                  "{testimonial.text}"
                </p>
              </div>

              <div className="pt-5 border-t border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-zinc-900">
                    {testimonial.author}
                  </h4>
                  <span className="text-xs text-zinc-500 font-sans">
                    Patient at Kush Dental
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#DCA51B]/40 flex items-center justify-center text-[#DCA51B] font-serif font-bold text-sm">
                  {testimonial.author.charAt(0)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
