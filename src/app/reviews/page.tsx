"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { db } from "@/services/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { toast } from "react-hot-toast";

import { getPageContent } from "@/services/content";

const DEFAULT_REVIEWS_CONTENT = {
  title: "What Our Guests Say"
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState(DEFAULT_REVIEWS_CONTENT);
  
  // Load page content
  useEffect(() => {
    getPageContent("reviews", DEFAULT_REVIEWS_CONTENT).then(setContent);
  }, []);

  // Form state
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(fetchedReviews.length > 0 ? fetchedReviews : [
        { id: "1", name: "Sarah L.", rating: 5, comment: "Absolutely love the warm aesthetic and the Salted Caramel Latte is to die for! My new favorite study spot." },
        { id: "2", name: "Michael R.", rating: 5, comment: "Best espresso in Porterville, hands down. The staff remembers my order every morning." },
        { id: "3", name: "David M.", rating: 5, comment: "A true gem. The handmade desserts pair perfectly with their artisanal pour-overs." }
      ]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        name,
        rating,
        comment,
        createdAt: serverTimestamp(),
      });
      toast.success("Review submitted! Thank you for your feedback.");
      setName("");
      setComment("");
      setRating(5);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-sand min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Reviews Summary List */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-950 mb-2">{content.title}</h1>
            <div className="flex items-center gap-4 mb-12">
              <div className="flex text-brand-500">
                {[...Array(5)].map((_, i) => (
                   <Star key={i} fill={i < 4 ? "currentColor" : "none"} size={28} />
                ))}
              </div>
              <span className="text-2xl font-bold text-brand-900">4.9</span>
              <span className="text-brand-600">({reviews.length} Reviews)</span>
            </div>

            <div className="space-y-8">
              {loading ? (
                <div className="flex justify-center py-12">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-800"></div>
                </div>
              ) : reviews.map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-brand-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-brand-950">{review.name}</h3>
                    <div className="flex text-brand-500">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} fill={i < review.rating ? "currentColor" : "none"} size={16} />
                       ))}
                    </div>
                  </div>
                  <p className="text-brand-700 leading-relaxed italic">&quot;{review.comment}&quot;</p>
                </div>
              ))}
            </div>
          </div>

          {/* Review Form */}
          <div className="lg:col-span-5">
            <div className="bg-brand-950 text-white p-8 md:p-12 rounded-3xl sticky top-32 shadow-2xl">
              <h2 className="text-3xl font-bold mb-6">Leave a Review</h2>
              <p className="text-brand-200 mb-8">We would love to hear about your experience at The Mud House.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-brand-200 text-sm mb-2">Your Rating</label>
                  <div className="flex gap-2 text-brand-400">
                     {[1, 2, 3, 4, 5].map((num) => (
                       <button
                         key={num}
                         type="button"
                         onClick={() => setRating(num)}
                         className={`transition-colors ${rating >= num ? "text-brand-500" : "text-brand-800 hover:text-brand-600"}`}
                       >
                         <Star size={28} fill={rating >= num ? "currentColor" : "none"} />
                       </button>
                     ))}
                  </div>
                </div>
                <div>
                  <label className="block text-brand-200 text-sm mb-2" htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-brand-900 border border-brand-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-brand-200 text-sm mb-2" htmlFor="review">Your Review</label>
                  <textarea 
                    id="review" 
                    rows={4} 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full bg-brand-900 border border-brand-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors" 
                    placeholder="Tell us what you loved..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-white text-brand-950 font-bold py-4 rounded-lg hover:bg-brand-100 transition-colors shadow-lg disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
