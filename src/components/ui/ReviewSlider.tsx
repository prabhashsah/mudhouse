"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageCircle, Send, X } from "lucide-react";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";

export default function ReviewSlider() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          setReviews([
            { id: "fallback-1", name: "Sarah Jenkins", rating: 5, text: "The best salted caramel latte I have ever had! The ambiance is perfect for studying or just relaxing with friends." },
            { id: "fallback-2", name: "Michael Chen", rating: 4, text: "Great place, really love the handmade desserts. The Red Velvet cupcake is a must-try." },
            { id: "fallback-3", name: "Emily RT", rating: 5, text: "Such a cozy spot. Friendly staff and consistently amazing espresso drinks." },
          ]);
        }
        setLoading(false);
      }, () => {
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;
    
    setSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        name,
        rating,
        text,
        createdAt: serverTimestamp()
      });
      setIsWriting(false);
      setName("");
      setText("");
      setRating(5);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to submit review. Firebase may not be configured.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-brand-950 text-white relative flex justify-center items-center overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-brand-800 pb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Guests Say</h2>
            <p className="text-brand-300 text-lg">Real stories from our beloved community.</p>
          </div>
          <button 
            onClick={() => setIsWriting(!isWriting)}
            className="mt-6 md:mt-0 bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-full font-medium transition-all flex items-center shadow-lg hover:shadow-brand-600/30"
          >
            {isWriting ? <X className="mr-2" size={18} /> : <MessageCircle className="mr-2" size={18} />}
            {isWriting ? "Cancel" : "Write a Review"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isWriting ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-brand-900 p-8 rounded-2xl max-w-2xl mx-auto shadow-2xl mb-12 border border-brand-800"
            >
              <h3 className="text-2xl font-bold mb-6 text-center text-brand-100">Share Your Experience</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-brand-300 mb-1">Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-brand-950 border border-brand-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-brand-300 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                        <Star size={28} className={star <= rating ? "fill-yellow-500 text-yellow-500" : "text-brand-700"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-brand-300 mb-1">Your Review</label>
                  <textarea value={text} onChange={e => setText(e.target.value)} required rows={4} className="w-full bg-brand-950 border border-brand-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none"></textarea>
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-lg mt-6 flex justify-center items-center disabled:opacity-50 transition-colors">
                  {submitting ? "Submitting..." : <><Send size={18} className="mr-2"/> Submit Review</>}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="reviews"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {loading ? (
                 <div className="col-span-full py-12 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                 </div>
              ) : reviews.slice(0, 6).map((review) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={review.id} 
                  className="bg-brand-900 border border-brand-800 p-8 rounded-2xl flex flex-col items-start"
                >
                  <div className="flex mb-4 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-brand-700"} />
                    ))}
                  </div>
                  <p className="text-brand-100 mb-6 italic leading-relaxed flex-grow">"{review.text}"</p>
                  <div className="mt-auto pt-4 border-t border-brand-800 w-full font-medium text-brand-400">
                    - {review.name}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
