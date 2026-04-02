"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/services/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const q = query(collection(db, "subscribers"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setStatus("error");
        setMessage("You are already subscribed!");
        return;
      }

      await addDoc(collection(db, "subscribers"), {
        email,
        subscribedAt: serverTimestamp(),
      });

      setStatus("success");
      setMessage("Thanks for subscribing!");
      setEmail("");
    } catch (error) {
      console.error("Newsletter error:", error);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="bg-brand-950 text-brand-100 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-white">The Mud House</h3>
            <p className="text-sm text-brand-200 mb-6 leading-relaxed">
              Where every cup feels like home. Premium coffee, cozy atmosphere, and handmade desserts in the heart of Porterville.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-brand-900 flex items-center justify-center hover:bg-brand-700 transition-colors text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-brand-900 flex items-center justify-center hover:bg-brand-700 transition-colors text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full bg-brand-900 flex items-center justify-center hover:bg-brand-700 transition-colors text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733-16z"></path><path d="M4 20l6.768-6.768m2.46-2.46L20 4"></path></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-brand-300 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link href="/menu" className="text-brand-300 hover:text-white transition-colors text-sm">Menu</Link></li>
              <li><Link href="/about" className="text-brand-300 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/gallery" className="text-brand-300 hover:text-white transition-colors text-sm">Gallery</Link></li>
              <li><Link href="/reviews" className="text-brand-300 hover:text-white transition-colors text-sm">Reviews</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact Info</h4>
            <ul className="space-y-3 text-sm text-brand-300">
              <li className="hover:text-white transition-colors cursor-default">34 E Garden Ave, Porterville, CA</li>
              <li><a href="tel:+9779702032444" className="hover:text-white transition-colors">+977 9702032444</a></li>
              <li><a href="mailto:hello@themudhouse.com" className="hover:text-white transition-colors">hello@themudhouse.com</a></li>
              <li><a href="https://wa.me/9779702032444?text=Hello%20I%20want%20to%20know%20about%20your%20coffee" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors font-medium">Chat on WhatsApp</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Newsletter</h4>
            <p className="text-sm text-brand-300 mb-4">Subscribe for updates on our special drinks and events.</p>
            <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
              <div className="flex">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  className="w-full bg-brand-900 border border-brand-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:border-brand-600 text-sm"
                  required
                  suppressHydrationWarning
                />
                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-r-md transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {status === "loading" ? "..." : "Subscribe"}
                </button>
              </div>
              {message && (
                <p className={`text-xs mt-1 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-brand-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-brand-400 mb-4 md:mb-0">
            &copy; {year} The Mud House. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-brand-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
