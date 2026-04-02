"use client";

import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Star, Trash2, MessageSquare, Calendar, User, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteDoc(doc(db, "reviews", id));
      toast.success("Review deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const calculateAverage = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-brand-100">
        <h3 className="text-xl font-bold text-brand-950 flex items-center gap-3">
          <Star size={24} className="text-brand-500 fill-brand-500" />
          {calculateAverage()} Average Rating ({reviews.length} reviews)
        </h3>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-3xl border border-brand-100">
           <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
           <p className="font-bold text-brand-800">Loading Reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-brand-200 shadow-sm animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-200">
            <Star size={40} />
          </div>
          <h3 className="text-2xl font-bold text-brand-950 mb-2">No reviews yet</h3>
          <p className="text-brand-500 max-w-xs mx-auto">Customer reviews from the platform will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-8 rounded-3xl shadow-sm border border-brand-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 font-bold">
                    {rev.name?.[0].toUpperCase() || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-950">{rev.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-brand-400 mt-0.5">
                      <Calendar size={12} />
                      {rev.createdAt?.toDate().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteReview(rev.id)}
                  className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="flex gap-1 text-brand-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < (rev.rating || 0) ? "currentColor" : "none"} />
                ))}
              </div>
              
              <div className="bg-brand-50/30 p-4 rounded-xl text-brand-800 text-sm leading-relaxed border border-brand-100/30 italic">
                &quot;{rev.comment}&quot;
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
