import React, { useState } from 'react';
import { useOSStore } from '../store/useOSStore';
import { Mail, Send, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';
import { Github, Linkedin } from '../components/BrandIcons';

export const ContactApp: React.FC = () => {
  const { addNotification } = useOSStore();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMsg('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('sending');

    // Simulate sending email message
    setTimeout(() => {
      setStatus('success');
      addNotification('Message Sent!', `Thank you, ${formData.name}. I'll get back to you shortly!`, 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full font-sans select-text">
      {/* Social contacts Panel */}
      <div className="w-full md:w-56 bg-slate-950/40 border-b md:border-b-0 md:border-r border-white/5 p-5 space-y-5 select-none shrink-0 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-xs font-bold font-mono text-indigo-400 tracking-wider uppercase border-b border-white/5 pb-1">
            Connect Info
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Feel free to drop a message! I usually reply within 24 hours.
          </p>

          <div className="space-y-2 pt-2">
            <a 
              href="mailto:kkskumarsahu31@gmail.com" 
              className="flex items-center space-x-2.5 text-xs text-slate-300 hover:text-indigo-400 transition font-mono"
            >
              <Mail size={14} className="text-indigo-400" />
              <span className="truncate text-[10px]">kkskumarsahu31@gmail.com</span>
            </a>
            <a 
              href="https://github.com/khushalkks" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center space-x-2.5 text-xs text-slate-300 hover:text-indigo-400 transition font-mono"
            >
              <Github size={14} className="text-indigo-400" />
              <span>github.com/khushalkks</span>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center space-x-2.5 text-xs text-slate-300 hover:text-indigo-400 transition font-mono"
            >
              <Linkedin size={14} className="text-indigo-400" />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="hidden md:block p-3 bg-slate-900 border border-white/5 rounded-xl font-mono text-[9px] text-slate-500 leading-normal">
          <div>ENCRYPTED PROTOCOL</div>
          <div className="mt-0.5 text-indigo-400/80">STATUS: SECURE_SSL</div>
        </div>
      </div>

      {/* Contact Form Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {status === 'success' ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 select-none animate-fade-in py-10">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-neon-green">
              <CheckCircle size={32} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white font-display">MESSAGE DEPLOYED!</h2>
              <p className="text-xs text-slate-400 font-mono">Your email package was sent successfully through our mock server.</p>
            </div>
            <button 
              onClick={() => setStatus('idle')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs rounded-xl shadow-lg hover:shadow-neon-blue transition"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                <MessageSquare size={16} className="text-indigo-400" />
                <h2 className="text-sm font-bold font-display text-white">NEW MESSAGE OUTBOX</h2>
              </div>

              {status === 'error' && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl flex items-start space-x-2 text-xs font-mono animate-fade-in">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Grid Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 font-mono">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={status === 'sending'}
                    placeholder="John Doe"
                    className="w-full bg-slate-900 border border-white/5 rounded-xl py-2 px-3 text-xs outline-none text-slate-200 focus:border-indigo-500 transition"
                    required
                  />
                </div>

                <div className="space-y-1 font-mono">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Your Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={status === 'sending'}
                    placeholder="john@example.com"
                    className="w-full bg-slate-900 border border-white/5 rounded-xl py-2 px-3 text-xs outline-none text-slate-200 focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1 font-mono">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  disabled={status === 'sending'}
                  placeholder="Opportunity / Collaboration"
                  className="w-full bg-slate-900 border border-white/5 rounded-xl py-2 px-3 text-xs outline-none text-slate-200 focus:border-indigo-500 transition"
                />
              </div>

              {/* Message */}
              <div className="space-y-1 font-mono">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Message Body *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={status === 'sending'}
                  placeholder="Write your email details here..."
                  rows={5}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl py-2.5 px-3 text-xs outline-none text-slate-200 focus:border-indigo-500 transition resize-none"
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/5 mt-6 flex justify-end select-none">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-neon-blue flex items-center space-x-2 transition"
              >
                {status === 'sending' ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>TRANSMITTING MESSAGE PACKAGE...</span>
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
