"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/services/firebase";

export default function PopularItems() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Fetch dynamic items directly from Firebase
      const q = query(collection(db, "items"), orderBy("createdAt", "desc"), limit(4));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          setItems([]);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Error fetching popular items:", e);
      setLoading(false);
    }
  }, []);

  if (loading) {
     return (
        <div className="flex justify-center items-center h-64 w-full">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-800"></div>
        </div>
     )
  }

  if (items.length === 0) {
    // Fallback if database is empty to retain design
    return (
       <div className="text-center py-12 text-gray-400 font-medium">New delights are brewing. Check back soon!</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((item, i) => (
        <Link href="/menu" key={item.id || i}>
          <div className="bg-sand rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-2xl transition-all h-full flex flex-col">
            <div className="relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
              {item.imageUrl ? (
                 <img 
                   src={item.imageUrl} 
                   alt={item.title} 
                   className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                 />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            <div className="p-6 flex justify-between items-start flex-col flex-grow bg-white">
              <div className="flex justify-between w-full mb-2">
                 <h3 className="text-lg font-bold text-brand-950 truncate">{item.title}</h3>
                 <span className="font-bold text-brand-700">${Number(item.price).toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{item.description}</p>
              <p className="text-brand-600 font-medium text-sm">View in Menu →</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
