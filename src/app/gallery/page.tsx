"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/services/firebase";

const GALLERY_CATEGORIES = ["All", "Drinks", "Interior", "Food", "Vibes"];

const FALLBACK_GALLERY_IMAGES = [
  { id: "1", src: "/images/latte_art_1775139905103.png", category: "Drinks", alt: "Latte Art" },
  { id: "2", src: "/images/coffee_shop_interior_1775139841114.png", category: "Interior", alt: "Coffee Shop Seating" },
  { id: "3", src: "/images/hero_coffee_bg_1775139729901.png", category: "Vibes", alt: "Coffee cup aesthetic" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, "gallery_images"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          setImages(FALLBACK_GALLERY_IMAGES);
        }
        setLoading(false);
      }, () => {
        setImages(FALLBACK_GALLERY_IMAGES);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      setImages(FALLBACK_GALLERY_IMAGES);
      setLoading(false);
    }
  }, []);

  const filteredImages = activeCategory === "All" 
    ? images 
    : images.filter(img => img.category === activeCategory);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) setSelectedIndex((selectedIndex + 1) % filteredImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) setSelectedIndex(selectedIndex === 0 ? filteredImages.length - 1 : selectedIndex - 1);
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-brand-950 mb-6">Our Gallery</h1>
          <p className="text-lg text-brand-700 max-w-2xl mx-auto">
            A glimpse into the daily life, beautiful creations, and cozy corners of The Mud House.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {GALLERY_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category 
                  ? "bg-brand-900 text-white scale-105 shadow-md" 
                  : "bg-sand text-brand-900 hover:bg-brand-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-800"></div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredImages.map((img, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={img.id} 
                  className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group shadow-sm"
                  onClick={() => setSelectedIndex(index)}
                >
                  <Image 
                    src={img.src} 
                    alt={img.alt || "Gallery image"} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-brand-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white/90 backdrop-blur-sm text-brand-950 px-4 py-2 rounded-full font-medium text-sm transition-transform group-hover:scale-110">View</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Modal */}
        {selectedIndex !== null && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-950/95 backdrop-blur-md p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white hover:text-brand-300 transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
              onClick={() => setSelectedIndex(null)}
            >
               <X size={32} />
            </button>

            <button 
              className="absolute left-8 top-1/2 -translate-y-1/2 text-white hover:text-brand-300 transition-colors bg-white/10 hover:bg-white/20 p-3 rounded-full hidden sm:block"
              onClick={prevImage}
            >
               <ChevronLeft size={32} />
            </button>

            <button 
              className="absolute right-8 top-1/2 -translate-y-1/2 text-white hover:text-brand-300 transition-colors bg-white/10 hover:bg-white/20 p-3 rounded-full hidden sm:block"
              onClick={nextImage}
            >
               <ChevronRight size={32} />
            </button>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={filteredImages[selectedIndex].src} 
                alt={filteredImages[selectedIndex].alt || "Expanded gallery image"} 
                fill 
                className="object-contain"
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
