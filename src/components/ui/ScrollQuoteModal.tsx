'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, User, Mail, Phone, MessageSquare, Send } from 'lucide-react';
import { submitEnquiry } from '@/lib/cmsClient';

export default function ScrollQuoteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Trigger popup when user scrolls past 20% or 300px
  useEffect(() => {
    const handleScroll = () => {
      if (hasShown) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = (document.documentElement.scrollHeight || document.body.scrollHeight || 1) - window.innerHeight;
      const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      // Trigger popup when scrolled past 20% or 300px
      if (scrollTop > 4500 || scrollPercentage > 400) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also run once in case page loaded already scrolled
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasShown]);

  // Lock body & html scroll completely when popup modal is active
  useEffect(() => {
    if (isOpen) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    setIsSubmitting(true);
    try {
      await submitEnquiry({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        source: 'Scroll Popup Quote',
      });
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch {
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[540px] overflow-hidden rounded-[32px] bg-white p-8 sm:p-10 text-slate-800 shadow-2xl border border-slate-100 font-sans"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 pr-10">
              <h3 className="text-3xl sm:text-[34px] font-black tracking-tight text-[#29247c] font-heading">
                Request a Quote
              </h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Let us know what you need, and our property experts will get back to you.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-2xl font-bold text-[#29247c] font-heading">Thank You!</h4>
                <p className="text-sm text-slate-600">
                  Your inquiry has been submitted successfully. Our team will contact you shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                {/* Full Name */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    suppressHydrationWarning
                    placeholder="Enter your full name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-300 focus:border-[#29247c] focus:bg-white focus:ring-4 focus:ring-[#29247c]/10"
                  />
                </div>

                {/* Email & Phone grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      suppressHydrationWarning
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-300 focus:border-[#29247c] focus:bg-white focus:ring-4 focus:ring-[#29247c]/10"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <input
                      type="tel"
                      required
                      suppressHydrationWarning
                      placeholder="Mobile Number *"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-300 focus:border-[#29247c] focus:bg-white focus:ring-4 focus:ring-[#29247c]/10"
                    />
                  </div>
                </div>

                {/* Message / Specific Requirement */}
                <div>
                  <textarea
                    rows={3}
                    suppressHydrationWarning
                    placeholder="Message or property requirement..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-300 focus:border-[#29247c] focus:bg-white focus:ring-4 focus:ring-[#29247c]/10"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  suppressHydrationWarning
                  className="mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#f12131] text-sm sm:text-base font-extrabold text-white shadow-xl shadow-red-500/25 transition-all hover:bg-[#d81928] hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer font-heading tracking-wide"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Submit Request'}</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
