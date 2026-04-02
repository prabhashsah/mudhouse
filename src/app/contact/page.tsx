"use client";

import { useState } from "react";
import { db } from "@/services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Send, Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      console.error("Contact form error:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-brand-950 mb-6">Contact Us</h1>
          <p className="text-lg text-brand-700">
            Have a question, feedback, or just want to say hi? We’d love to hear from you.
          </p>
        </div>

        <div className="bg-sand p-8 md:p-12 rounded-3xl shadow-lg border border-brand-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-brand-950 mb-2">Get in Touch</h3>
                <p className="text-brand-700 leading-relaxed">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>
              
              <div className="space-y-4">
                <a href="tel:+9779702032444" className="block bg-white p-6 rounded-2xl shadow-sm border border-brand-100 hover:border-brand-500 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-50 rounded-xl text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-brand-500 font-bold uppercase tracking-wider">Phone</p>
                        <p className="text-lg font-medium text-brand-900">+977 9702032444</p>
                      </div>
                    </div>
                </a>
                <a href="mailto:hello@themudhouse.com" className="block bg-white p-6 rounded-2xl shadow-sm border border-brand-100 hover:border-brand-500 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-50 rounded-xl text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-brand-500 font-bold uppercase tracking-wider">Email</p>
                        <p className="text-lg font-medium text-brand-900">hello@themudhouse.com</p>
                      </div>
                    </div>
                </a>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-50 rounded-xl text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-brand-500 font-bold uppercase tracking-wider">Location</p>
                        <p className="text-lg font-medium text-brand-900">34 E Garden Ave, CA</p>
                      </div>
                    </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-brand-500 font-bold uppercase tracking-wider mb-4">Follow Us</p>
                <div className="flex gap-4">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 rounded-full border border-brand-300 flex items-center justify-center text-brand-800 hover:bg-brand-800 hover:text-white transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-12 h-12 rounded-full border border-brand-300 flex items-center justify-center text-brand-800 hover:bg-brand-800 hover:text-white transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-12 h-12 rounded-full border border-brand-300 flex items-center justify-center text-brand-800 hover:bg-brand-800 hover:text-white transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733-16z"></path><path d="M4 20l6.768-6.768m2.46-2.46L20 4"></path></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100 space-y-6">
                {success && <div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700 text-sm">Message sent successfully! We'll be in touch.</div>}
                {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">{error}</div>}
                
                <div>
                  <label htmlFor="name" className="block text-brand-900 font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-sand border border-brand-200 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900" 
                    placeholder="Jane Doe" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-brand-900 font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-sand border border-brand-200 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900" 
                    placeholder="jane@example.com" 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-brand-900 font-medium mb-2">Your Message</label>
                  <textarea 
                    id="message" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5} 
                    className="w-full bg-sand border border-brand-200 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900 resize-none" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-brand-800 hover:bg-brand-900 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Sending..." : <><Send size={18} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
