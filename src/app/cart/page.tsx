"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { db } from "@/services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart, placeOrder, isProcessing } = useCart();
  const [email, setEmail] = useState("");

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      await placeOrder(email || "anonymous");
      toast.success("Order placed successfully! We are preparing your coffee.");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 bg-sand min-h-screen flex flex-col items-center justify-center px-6">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full">
          <div className="bg-brand-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-brand-300" />
          </div>
          <h1 className="text-3xl font-bold text-brand-950 mb-4">Your cart is empty</h1>
          <p className="text-brand-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            href="/menu" 
            className="inline-flex items-center gap-2 bg-brand-800 text-white px-8 py-4 rounded-full font-bold hover:bg-brand-900 transition-all shadow-lg"
          >
            <Home size={18} />
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-sand min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="text-4xl font-bold text-brand-950 mb-12 flex items-center gap-4">
          <ShoppingBag size={36} />
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-brand-100 flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-brand-950">{item.name}</h3>
                  <p className="text-brand-500 text-sm">{item.category}</p>
                  <p className="text-brand-800 font-bold mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 bg-brand-50 p-2 rounded-xl">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:text-brand-800 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-bold w-6 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:text-brand-800 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-brand-100 sticky top-32">
              <h2 className="text-2xl font-bold text-brand-950 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-brand-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-600">
                  <span>Delivery fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="h-px bg-brand-100" />
                <div className="flex justify-between text-2xl font-bold text-brand-950">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Email Address (Optional)</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-brand-800 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-brand-900 transition-all shadow-lg disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Complete Order"}
                  <ArrowRight size={20} />
                </button>
              </form>
              
              <p className="text-xs text-center text-brand-400 mt-6 leading-relaxed">
                By completing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
