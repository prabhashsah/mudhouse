"use client";

import Link from "next/link";
import { ShoppingBag, ChevronLeft, Star, Coffee, Info } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import SafeImage from "@/components/ui/SafeImage";

interface ProductDetailClientProps {
  product: any;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || "/images/latte_art_1775139905103.png",
      category: product.category
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="pt-32 pb-24 bg-sand min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link href="/menu" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 mb-12 font-medium transition-all group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Menu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Column */}
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/50">
            <SafeImage
              src={product.imageUrl}
              alt={product.name}
              fill
              className=""
            />
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-3xl font-black uppercase tracking-widest border-4 border-white px-8 py-4 rounded-2xl rotate-[-10deg]">Sold Out</span>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-brand-100 text-brand-800 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                  {product.category}
                </span>
                {product.popular && (
                  <span className="bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1">
                    <Star size={12} className="fill-orange-700" /> Best Seller
                  </span>
                )}
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-brand-950 tracking-tighter leading-tight">
                {product.name}
              </h1>
              <p className="text-4xl font-bold text-brand-800">
                ${product.price?.toFixed(2)}
              </p>
            </div>

            <div className="h-px bg-brand-200 w-full" />

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-brand-900 flex items-center gap-2">
                <Info size={20} /> Product Story
              </h3>
              <p className="text-lg text-brand-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <button 
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className="w-full bg-brand-950 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-4 hover:bg-brand-800 transition-all shadow-xl hover:shadow-brand-900/20 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
                {product.isAvailable ? "Add to Order" : "Currently Unavailable"}
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/50 p-4 rounded-2xl border border-brand-100 flex flex-col items-center text-center">
                    <Coffee size={24} className="text-brand-400 mb-2" />
                    <span className="text-xs font-bold text-brand-900 uppercase">Premium Quality</span>
                 </div>
                 <div className="bg-white/50 p-4 rounded-2xl border border-brand-100 flex flex-col items-center text-center">
                    <Star size={24} className="text-brand-400 mb-2" />
                    <span className="text-xs font-bold text-brand-900 uppercase">Freshly Made</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
