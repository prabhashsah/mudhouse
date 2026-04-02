"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FloatingCart() {
  const { totalItems, totalPrice } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (totalItems > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [totalItems]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6"
        >
          <Link 
            href="/cart"
            className="flex items-center justify-between bg-brand-950 text-white p-4 rounded-2xl shadow-2xl shadow-brand-950/40 hover:bg-brand-900 transition-all group active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -top-2 -right-2 bg-brand-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-950">
                  {totalItems}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase tracking-widest text-brand-400 group-hover:text-brand-300 transition-colors">View Your Cart</span>
                <span className="text-xs font-bold text-brand-200">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in basket
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-xs font-black uppercase tracking-widest text-brand-400">Total</span>
              <span className="text-lg font-black">${totalPrice.toFixed(2)}</span>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
