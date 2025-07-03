"use client";
import { useEffect, useState, useTransition, useDeferredValue } from "react";
import { GlassButton, GlassIcon } from "@/app/components/Glassmorphism";

const ContactFormGlass = ({ initialName = "", initialEmail = "", initialPhone = "" }) => {
  const [formData, setFormData] = useState({
    name: initialName,
    email: initialEmail,
    phone: initialPhone,
    subject: "",
    message: ""
  });

  // React 18 concurrent features
  const [isPending, startTransition] = useTransition();
  const deferredMessage = useDeferredValue(formData.message);

  // Update state if props change (e.g., on navigation)
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: initialName,
      email: initialEmail,
      phone: initialPhone
    }));
  }, [initialName, initialEmail, initialPhone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    startTransition(() => {
      // Create email content using deferred values for better performance
      const emailBody = `
Dear Thiasil Team,

I hope this message finds you well. I am reaching out regarding the following inquiry:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

Subject: ${formData.subject}

Message:
${deferredMessage}

I look forward to hearing from you.

Best regards,
${formData.name}
      `.trim();

      // Create mailto link
      const mailtoLink = `mailto:thiaglasswork@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open default mail app
      window.open(mailtoLink, '_blank');
    });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-hidden focus:ring-2 focus:ring-[#3a8fff]/50 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <GlassIcon icon="👤" variant="primary" size="small" />
              </div>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-hidden focus:ring-2 focus:ring-[#3a8fff]/50 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <GlassIcon icon="📧" variant="primary" size="small" />
              </div>
            </div>
          </div>
        </div>

        {/* Phone and Subject Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-hidden focus:ring-2 focus:ring-[#3a8fff]/50 focus:border-transparent transition-all"
                placeholder="Enter your phone number"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <GlassIcon icon="📞" variant="primary" size="small" />
              </div>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-2">
              Subject *
            </label>
            <div className="relative">
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-hidden focus:ring-2 focus:ring-[#3a8fff]/50 focus:border-transparent transition-all"
                placeholder="What is this about?"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <GlassIcon icon="📝" variant="primary" size="small" />
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="relative">
          <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
            Message *
          </label>
          <div className="relative">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-hidden focus:ring-2 focus:ring-[#3a8fff]/50 focus:border-transparent transition-all resize-none"
              placeholder="Tell us about your inquiry, requirements, or any questions you have..."
            />
            <div className="absolute top-3 right-3 pointer-events-none">
              <GlassIcon icon="💬" variant="primary" size="small" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-white/60">
            * Required fields
          </div>
          <GlassButton
            type="submit"
            variant="accent"
            size="large"
            className="min-w-[140px]"
            disabled={isPending}
          >
            <div className="flex items-center gap-2">
              <span>{isPending ? 'Sending...' : 'Send Email'}</span>
              <span>{isPending ? '⏳' : '→'}</span>
            </div>
          </GlassButton>
        </div>

        {/* Info Message */}
        <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <GlassIcon icon="ℹ️" variant="primary" size="medium" />
            <div>
              <h4 className="text-blue-300 font-semibold">Email Client Required</h4>
              <p className="text-blue-200 text-sm">This will open your default email application with a pre-filled message ready to send.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactFormGlass; 