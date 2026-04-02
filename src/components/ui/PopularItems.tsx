"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import SafeImage from "@/components/ui/SafeImage";

export default function PopularItems() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"), limit(4));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
        setFetchError(null);
      },
      (error) => {
        console.error("Firestore error in PopularItems:", error);
        if (error.message?.includes("index")) {
          setFetchError(
            "Database index required. Check browser console for the setup link, then refresh."
          );
        } else {
          setFetchError("Failed to load items. Please refresh the page.");
        }
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleQuickAdd = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image:
        item.imageUrl ||
        "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80",
      category: item.category,
    });
    toast.success(`Added ${item.name} to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <Loader2 className="animate-spin text-brand-800" size={40} />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-red-500 gap-3">
        <AlertCircle size={32} />
        <p className="text-center text-sm font-medium max-w-sm">{fetchError}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-brand-400 font-medium italic">
        New delights are brewing. Check back soon!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((item) => (
        <Link href={`/product/${item.id}`} key={item.id} className="group">
          <div className="bg-sand rounded-[2.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all h-full flex flex-col border border-brand-100 bg-white">
            <div className="relative h-64 overflow-hidden bg-brand-50">
              <SafeImage
                src={item.imageUrl}
                alt={item.name}
                fill
                className="group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-brand-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full z-10 transition-transform group-hover:scale-110 shadow-lg">
                {item.category}
              </div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black text-brand-950 leading-tight group-hover:text-brand-800 transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <span className="font-black text-brand-800 text-lg ml-2">
                  ${Number(item.price).toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-brand-500 line-clamp-2 mb-8 leading-relaxed italic flex-grow">
                {item.description}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-brand-50">
                <span className="text-brand-950 font-black text-xs uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                  Details →
                </span>
                <button
                  onClick={(e) => handleQuickAdd(e, item)}
                  className="w-12 h-12 rounded-2xl bg-brand-950 text-white flex items-center justify-center hover:bg-brand-600 transition-all shadow-xl hover:shadow-brand-600/20 active:scale-90"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
