"use client";

import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from "firebase/firestore";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import { getPageContent } from "@/services/content";
import type { ContactSettings } from "@/services/settings";

const DEFAULT_SETTINGS: ContactSettings = {
  email: "hello@themudhouse.com",
  phone: "+977 9702032444",
  address: "Baluwatar, Kathmandu, Nepal",
  whatsapp: "9779702032444",
  locationUrl: "https://maps.google.com/?q=Baluwatar,Kathmandu,Nepal",
  openingHours: "07:00 AM - 10:00 PM"
};

const DEFAULT_CONTACT_CONTENT = {
  heroTitle: "Get in Touch",
  heroText: "Have a question about our coffee, our menu, or hosting an event? We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.",
  formTitle: "Send a Message",
  formText: "Fill out the form below and our team will respond within 24 hours."
};

export default function ContactPage() {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_SETTINGS);
  const [content, setContent] = useState(DEFAULT_CONTACT_CONTENT);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Real-time listener for site settings (Contact Info)
    const unsubscribe = onSnapshot(doc(db, "site_settings", "contact"), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as ContactSettings);
      }
    });

    // Load page-specific content (Titles/Texts)
    getPageContent("contact", DEFAULT_CONTACT_CONTENT).then(setContent);

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "messages"), {
        ...formState,
        createdAt: serverTimestamp(),
        status: "new"
      });
      toast.success("Message sent successfully! We'll be in touch.");
      setFormState({ name: "", email: "", message: "" });
    } catch (err: any) {
      console.error("Contact form error:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-brand-950 mb-6">{content.heroTitle}</h1>
          <p className="text-xl text-brand-700 leading-relaxed">
            {content.heroText}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-sand p-10 rounded-3xl space-y-10 border border-brand-100">
              <div className="space-y-6">
                <a 
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`} 
                  className="block bg-white p-6 rounded-2xl shadow-sm border border-brand-100 hover:border-brand-500 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-50 rounded-xl text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-brand-500 font-bold uppercase tracking-wider">Phone</p>
                      <p className="text-lg font-medium text-brand-900">{settings.phone}</p>
                    </div>
                  </div>
                </a>

                <a 
                  href={`mailto:${settings.email}`} 
                  className="block bg-white p-6 rounded-2xl shadow-sm border border-brand-100 hover:border-brand-500 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-50 rounded-xl text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-brand-500 font-bold uppercase tracking-wider">Email</p>
                      <p className="text-lg font-medium text-brand-900">{settings.email}</p>
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
                      <p className="text-lg font-medium text-brand-900">{settings.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-brand-500 font-bold uppercase tracking-wider mb-4">Find Us On</p>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 rounded-full border border-brand-300 flex items-center justify-center text-brand-800 hover:bg-brand-800 hover:text-white transition-all">
                    <span className="font-bold">In</span>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full border border-brand-300 flex items-center justify-center text-brand-800 hover:bg-brand-800 hover:text-white transition-all">
                    <span className="font-bold">Fb</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-brand-50">
              <h2 className="text-3xl font-bold text-brand-950 mb-4">{content.formTitle}</h2>
              <p className="text-brand-700 mb-10">{content.formText}</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-brand-900 font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    required
                    className="w-full bg-sand border border-brand-200 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900" 
                    placeholder="Your Name" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-brand-900 font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    required
                    className="w-full bg-sand border border-brand-200 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900" 
                    placeholder="your@email.com" 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-brand-900 font-medium mb-2">Your Message</label>
                  <textarea 
                    id="message" 
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    required
                    rows={6} 
                    className="w-full bg-sand border border-brand-200 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900 resize-none" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-brand-800 hover:bg-brand-900 text-white font-bold py-5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : <><Send size={18} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
