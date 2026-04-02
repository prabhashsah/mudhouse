"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/services/firebase";

// Fallback static data if Firebase is empty/unconfigured
const FALLBACK_MENU_ITEMS = [
  { id: "1", name: "Salted Caramel Latte", desc: "Espresso, steamed milk, caramel, sea salt", price: "$5.50", category: "Espresso Drinks", img: "/images/latte_art_1775139905103.png", popular: true },
  { id: "2", name: "Iced Americano", desc: "Double shot espresso over ice water", price: "$4.00", category: "Iced Coffee", img: "/images/latte_art_1775139905103.png", popular: false },
  { id: "3", name: "Vanilla Bean Frappe", desc: "Blended vanilla bean with milk and ice", price: "$6.00", category: "Iced Coffee", img: "/images/latte_art_1775139905103.png", popular: true },
  { id: "4", name: "Strawberry Matcha", desc: "Premium matcha layered with strawberry puree", price: "$6.50", category: "Teas & Refreshers", img: "/images/latte_art_1775139905103.png", popular: false },
  { id: "5", name: "Chamomile Citrus", desc: "Relaxing herbal tea with lemon hints", price: "$4.50", category: "Teas & Refreshers", img: "/images/latte_art_1775139905103.png", popular: false },
  { id: "6", name: "Red Velvet Cupcake", desc: "Moist cake with cream cheese frosting", price: "$4.00", category: "Desserts & Bakery", img: "/images/latte_art_1775139905103.png", popular: true },
  { id: "7", name: "Seasonal Pumpkin Spice", desc: "Fall favorite with cinnamon and nutmeg", price: "$5.75", category: "Seasonal Specials", img: "/images/latte_art_1775139905103.png", popular: true },
];

const MENU_CATEGORIES = ["All", "Espresso Drinks", "Iced Coffee", "Teas & Refreshers", "Desserts & Bakery", "Seasonal Specials"];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from Firebase, use fallback if empty or failing
  useEffect(() => {
    try {
      const q = query(collection(db, "menuItems"), orderBy("name"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMenuItems(items);
        } else {
          setMenuItems(FALLBACK_MENU_ITEMS);
        }
        setLoading(false);
      }, (err) => {
        console.error("Firebase error, using fallback:", err);
        setMenuItems(FALLBACK_MENU_ITEMS);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Firebase not configured properly, using fallback data", err);
      setMenuItems(FALLBACK_MENU_ITEMS);
      setLoading(false);
    }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 bg-sand min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-brand-950 mb-6">Our Menu</h1>
          <p className="text-lg text-brand-700 max-w-2xl mx-auto">
            Carefully crafted drinks and handmade treats made from the finest ingredients.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <div className="max-w-5xl mx-auto mb-16 space-y-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" size={20} />
            <input 
              type="text" 
              placeholder="Search drinks, desserts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white shadow-sm transition-all"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {MENU_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-all ${
                  activeCategory === category 
                    ? "bg-brand-800 text-white shadow-md scale-105" 
                    : "bg-white text-brand-900 border border-brand-200 hover:bg-brand-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-800"></div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredItems.map(item => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col cursor-pointer relative"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image 
                      src={item.img || "/images/latte_art_1775139905103.png"} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    
                    {/* Tags */}
                    {item.popular && (
                      <div className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                        Popular
                      </div>
                    )}
                    
                    {/* Favorite Button */}
                    <button 
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full shadow-md transition-all group-hover:scale-110 z-10"
                    >
                      <Heart 
                        size={20} 
                        className={favorites[item.id] ? "fill-red-500 text-red-500" : "text-brand-600"} 
                      />
                    </button>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="text-xl font-bold text-brand-950 leading-tight group-hover:text-brand-700 transition-colors">{item.name}</h3>
                      <span className="text-brand-700 font-semibold text-lg">{item.price}</span>
                    </div>
                    <p className="text-brand-600 text-sm mt-auto pt-4 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-16 text-brand-600 border-2 border-dashed border-brand-200 rounded-2xl">
                <p className="text-xl">No items found matching your search or category.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
